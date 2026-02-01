import React, { useState, useRef, useEffect } from 'react';
import type { Auditorium, ScheduleData, Movie, ShowTimeSlot } from '../types';
import {
    getPixelsFromTime,
    getTimeFromPixels,
    checkCollision,
    calculateEndTime,
    formatTime,
    START_HOUR,
    TOTAL_HOURS,
    PIXELS_PER_MIN
} from '../utils';

interface TimelineGridProps {
    auditoriums: Auditorium[];
    scheduleData: ScheduleData;
    movies: Movie[]; // Needed to lookup movie details for slots
    draggingMovie: Movie | null; // The movie currently being dragged from sidebar
    selectedDate: Date;
    onAddSlot: (auditoriumId: string, slot: ShowTimeSlot) => void;
    onUpdateSlot: (auditoriumId: string, slotId: string, updates: Partial<ShowTimeSlot>) => void;
    onDeleteSlot: (auditoriumId: string, slotId: string) => void;
    onMoveSlot: (fromAuditoriumId: string, toAuditoriumId: string, slot: ShowTimeSlot) => void;
}

const TimelineGrid: React.FC<TimelineGridProps> = ({
    auditoriums,
    scheduleData,
    movies,
    draggingMovie,
    selectedDate,
    onAddSlot,
    onUpdateSlot,
    onDeleteSlot,
    onMoveSlot
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [ghost, setGhost] = useState<{
        auditoriumId: string;
        start: Date;
        end: Date;
        valid: boolean;
        top: number;
        height: number;
    } | null>(null);

    // For resizing
    const [resizingSlot, setResizingSlot] = useState<{
        auditoriumId: string;
        slotId: string;
        initialY: number;
        initialHeight: number;
        start: Date;
    } | null>(null);

    // For moving existing slots
    const [movingSlot, setMovingSlot] = useState<{
        originalAuditoriumId: string;
        slot: ShowTimeSlot;
        movie: Movie;
        offsetX: number; // Offset from top of block
    } | null>(null);


    const TOTAL_HEIGHT = TOTAL_HOURS * 60 * PIXELS_PER_MIN;

    const handleDragOver = (e: React.DragEvent, auditoriumId: string) => {
        e.preventDefault();
        if (!draggingMovie && !movingSlot) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        let offsetY = e.clientY - rect.top + (e.currentTarget as HTMLElement).scrollTop;

        // Adjust for internal offset if moving an existing slot
        if (movingSlot) {
            offsetY -= movingSlot.offsetX;
        }

        // Snap to 5 minutes?
        const rawMinutes = offsetY / PIXELS_PER_MIN;
        const snappedMinutes = Math.round(rawMinutes / 10) * 10;
        const snappedPixel = snappedMinutes * PIXELS_PER_MIN;

        // Calculate times
        // Base date is just a reference, e.g., Today
        const baseDate = new Date(selectedDate);
        baseDate.setHours(START_HOUR, 0, 0, 0); // Base 08:00

        const startTimeLocal = getTimeFromPixels(snappedPixel, baseDate);

        let duration = 0;
        let format = '';

        if (draggingMovie) {
            duration = draggingMovie.durationMinutes;
            // Default to first format of movie or check auditorium compatibility??
            // For simplicity let's pick the first compatible format or just the first format
            format = draggingMovie.formats[0];
        } else if (movingSlot) {
            // Calculate duration based on existing slot
            const s = new Date(movingSlot.slot.start);
            const e = new Date(movingSlot.slot.end);
            duration = (e.getTime() - s.getTime()) / 60000;
            format = movingSlot.slot.formatId;

            // Adjust start time based on grab offset if we want precise dragging, 
            // but for now let's just snap the top to the cursor for simplicity or center it? 
            // Actually, usually we want the top to snap.
        }

        // Cleaning time is handled in calculateEndTime if it's a new slot. 
        // If moving, we might want to preserve exact duration including cleaning time?
        // Let's re-calculate end based on duration (cleaning included in 'duration' calculation logic?)
        // The user requirement says: "Auto set (Duration + Cleaning)".
        // So if draggingMovie, we add cleaning. If movingSlot, we keep its duration (which presumably includes cleaning).

        const cleaning = draggingMovie ? 20 : 0;
        // If moving, we assume the slot duration stays same.
        const effectiveDuration = draggingMovie ? (duration + cleaning) : duration;

        const endTimeLocal = new Date(startTimeLocal.getTime() + effectiveDuration * 60000);

        // Check collision
        const relevantSchedule = scheduleData.data.find(d => d.auditoriumId === auditoriumId);
        const existingSlots = relevantSchedule ? relevantSchedule.slots : [];

        // If moving, exclude itself
        const excludeId = movingSlot ? movingSlot.slot.id : undefined;

        const isColliding = checkCollision(startTimeLocal, endTimeLocal, existingSlots, excludeId);

        // Format compatibility check
        const aud = auditoriums.find(a => a.id === auditoriumId);
        const isFormatCompatible = aud?.supportedFormats.includes(format);

        setGhost({
            auditoriumId,
            start: startTimeLocal,
            end: endTimeLocal,
            valid: !isColliding && !!isFormatCompatible,
            top: snappedPixel,
            height: effectiveDuration * PIXELS_PER_MIN
        });
    };

    const handleDrop = (e: React.DragEvent, auditoriumId: string) => {
        e.preventDefault();
        if (!ghost || !ghost.valid) {
            setGhost(null);
            return;
        }

        if (draggingMovie) {
            const newSlot: ShowTimeSlot = {
                id: crypto.randomUUID(),
                movieId: draggingMovie.id,
                formatId: draggingMovie.formats.find(f => auditoriums.find(a => a.id === auditoriumId)?.supportedFormats.includes(f)) || draggingMovie.formats[0],
                start: ghost.start.toISOString(),
                end: ghost.end.toISOString(),
                price: 100 // default
            };
            onAddSlot(auditoriumId, newSlot);
        } else if (movingSlot) {
            // Luôn dùng onMoveSlot (một lần cập nhật) để tránh duplicate khi chuyển phòng/ngày
            const updatedSlot: ShowTimeSlot = {
                ...movingSlot.slot,
                start: ghost.start.toISOString(),
                end: ghost.end.toISOString()
            };
            onMoveSlot(movingSlot.originalAuditoriumId, auditoriumId, updatedSlot);
        }

        setGhost(null);
        setMovingSlot(null);
    };

    const handleDragLeave = () => {
        setGhost(null);
    };

    // Resize Logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizingSlot) return;

            const deltaY = e.clientY - resizingSlot.initialY;
            const newHeight = Math.max(30, resizingSlot.initialHeight + deltaY); // Min height 30px

            // Calculate new end time
            const durationMinutes = newHeight / PIXELS_PER_MIN;
            const newEnd = new Date(resizingSlot.start.getTime() + durationMinutes * 60000);

            // TODO: Collision check during resize?
            // Ideally yes.

            // For now just update visual? 
            // We can't update visual easily without updating state or a local ghost for resizer.
            // We will just commit on MouseUp for simplicity in this MVP turn.
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!resizingSlot) return;

            const deltaY = e.clientY - resizingSlot.initialY;
            const newHeight = Math.max(30, resizingSlot.initialHeight + deltaY);
            const durationMinutes = newHeight / PIXELS_PER_MIN;
            const newEnd = new Date(resizingSlot.start.getTime() + durationMinutes * 60000);

            onUpdateSlot(resizingSlot.auditoriumId, resizingSlot.slotId, {
                end: newEnd.toISOString()
            });

            setResizingSlot(null);
            document.body.style.cursor = 'default';
        };

        if (resizingSlot) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ns-resize';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, [resizingSlot, onUpdateSlot]);


    return (
        <div className="flex h-full select-none" ref={containerRef}>
            {/* Time Ruler */}
            <div className="w-16 flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative" style={{ height: TOTAL_HEIGHT + 40 }}>
                {/* +40 for header space */}
                <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 sticky top-0 z-20"></div>
                {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                    <div key={i} className="absolute w-full text-right pr-2 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800" style={{ top: i * 60 * PIXELS_PER_MIN + 40, height: 60 * PIXELS_PER_MIN }}>
                        <span className="-translate-y-1/2 block">{START_HOUR + i}:00</span>
                    </div>
                ))}
            </div>

            {/* Auditorium Columns */}
            <div className="flex flex-1 overflow-x-auto">
                {auditoriums.map(aud => {
                    const schedule = scheduleData.data.find(d => d.auditoriumId === aud.id);
                    const allSlots = schedule ? schedule.slots : [];
                    const slots = allSlots.filter(s => {
                        const d = new Date(s.start);
                        return d.getFullYear() === selectedDate.getFullYear() &&
                            d.getMonth() === selectedDate.getMonth() &&
                            d.getDate() === selectedDate.getDate();
                    });

                    return (
                        <div
                            key={aud.id}
                            className="min-w-[200px] flex-1 border-r border-slate-200 dark:border-slate-800 relative bg-white dark:bg-slate-950/50 group"
                            onDragOver={(e) => handleDragOver(e, aud.id)}
                            onDrop={(e) => handleDrop(e, aud.id)}
                            onDragLeave={handleDragLeave}
                        >
                            {/* Header */}
                            <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-slate-200 sticky top-0 z-10 px-2 text-center">
                                {aud.name}
                            </div>

                            {/* Grid Lines */}
                            <div className="relative" style={{ height: TOTAL_HEIGHT }}>
                                {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                                    <div key={i} className="absolute w-full border-t border-dashed border-slate-100 dark:border-slate-800/50 pointer-events-none" style={{ top: i * 60 * PIXELS_PER_MIN, height: 60 * PIXELS_PER_MIN }}></div>
                                ))}

                                {/* Slots */}
                                {slots.map(slot => {
                                    const movie = movies.find(m => m.id === slot.movieId);
                                    const top = getPixelsFromTime(slot.start);
                                    const bottom = getPixelsFromTime(slot.end);
                                    const height = bottom - top;

                                    return (
                                        <div
                                            key={slot.id}
                                            className="absolute left-1 right-1 rounded-md shadow-sm border border-black/10 overflow-hidden text-xs p-1 text-white hover:z-20 transition-all cursor-move"
                                            style={{
                                                top,
                                                height,
                                                backgroundColor: movie?.color || '#64748b'
                                            }}
                                            draggable
                                            onDragStart={(e) => {
                                                // Calculate offset from the top of the element to the mouse position
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const offsetY = e.clientY - rect.top;

                                                setMovingSlot({
                                                    originalAuditoriumId: aud.id,
                                                    slot,
                                                    movie: movie!,
                                                    offsetX: offsetY
                                                });

                                                // Create a transparent drag image
                                                const img = new Image();
                                                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                                                e.dataTransfer.setDragImage(img, 0, 0);

                                                // Set data for TrashCan or inter-window drag
                                                e.dataTransfer.setData('application/json', JSON.stringify({
                                                    type: 'SLOT',
                                                    auditoriumId: aud.id,
                                                    slotId: slot.id
                                                }));
                                            }}
                                        >
                                            <div className="font-bold truncate">{movie?.title || 'Unknown Movie'}</div>
                                            <div className="opacity-90">{formatTime(slot.start)} - {formatTime(slot.end)}</div>
                                            <div className="mt-1 opacity-75">{slot.formatId}</div>

                                            {/* Resize Handle */}
                                            <div
                                                className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-black/20"
                                                onMouseDown={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault(); // Stop drag start
                                                    setResizingSlot({
                                                        auditoriumId: aud.id,
                                                        slotId: slot.id,
                                                        initialY: e.clientY,
                                                        initialHeight: height,
                                                        start: new Date(slot.start)
                                                    });
                                                }}
                                            />
                                        </div>
                                    );
                                })}

                                {/* Ghost Block */}
                                {ghost && ghost.auditoriumId === aud.id && (
                                    <div
                                        className={`absolute left-1 right-1 rounded-md border-2 border-dashed flex items-center justify-center text-sm font-bold z-30 pointer-events-none
                            ${ghost.valid
                                                ? 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-300'
                                                : 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300'
                                            }`}
                                        style={{ top: ghost.top, height: ghost.height }}
                                    >
                                        {ghost.valid ? formatTime(ghost.start.toISOString()) : 'Collides!'}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineGrid;
