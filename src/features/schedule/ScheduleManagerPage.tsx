import React, { useState } from 'react';
import { INITIAL_SCHEDULE, SEED_AUDITORIUMS, SEED_MOVIES } from './data/seed';
import TimelineGrid from './components/TimelineGrid';
import DraggableMovie from './components/DraggableMovie';
import type { Movie, ScheduleData, ShowTimeSlot } from './types';
import { Calendar, Copy, Repeat, Save } from 'lucide-react';
import TrashCan from './components/TrashCan';

const ScheduleManagerPage: React.FC = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleData>(INITIAL_SCHEDULE);
    const [draggingMovie, setDraggingMovie] = useState<Movie | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<string>('All');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Derived state for filtering
    const filteredAuditoriums = selectedFormat === 'All'
        ? SEED_AUDITORIUMS
        : SEED_AUDITORIUMS.filter(a => a.supportedFormats.includes(selectedFormat));

    // Handlers
    const handleAddSlot = (auditoriumId: string, slot: ShowTimeSlot) => {
        setScheduleData(prev => {
            const newData = [...prev.data];
            const audIndex = newData.findIndex(d => d.auditoriumId === auditoriumId);

            if (audIndex >= 0) {
                newData[audIndex] = {
                    ...newData[audIndex],
                    slots: [...newData[audIndex].slots, slot]
                };
            } else {
                newData.push({ auditoriumId, slots: [slot] });
            }

            return { ...prev, data: newData };
        });
    };

    const handleUpdateSlot = (auditoriumId: string, slotId: string, updates: Partial<ShowTimeSlot>) => {
        setScheduleData(prev => {
            const newData = [...prev.data];
            const audIndex = newData.findIndex(d => d.auditoriumId === auditoriumId);

            if (audIndex >= 0) {
                const newSlots = newData[audIndex].slots.map(s => {
                    if (s.id === slotId) {
                        return { ...s, ...updates };
                    }
                    return s;
                });
                newData[audIndex] = { ...newData[audIndex], slots: newSlots };
            }
            return { ...prev, data: newData };
        });
    };

    const handleDeleteSlot = (auditoriumId: string, slotId: string) => {
        setScheduleData(prev => {
            const newData = [...prev.data];
            const audIndex = newData.findIndex(d => d.auditoriumId === auditoriumId);

            if (audIndex >= 0) {
                const newSlots = newData[audIndex].slots.filter(s => s.id !== slotId);
                newData[audIndex] = { ...newData[audIndex], slots: newSlots };
            }
            return { ...prev, data: newData };
        });
    };

    const handleMoveSlot = (fromAuditoriumId: string, toAuditoriumId: string, slot: ShowTimeSlot) => {
        setScheduleData(prev => {
            const newData = [...prev.data];

            // 1. Remove from source
            const fromIndex = newData.findIndex(d => d.auditoriumId === fromAuditoriumId);
            if (fromIndex >= 0) {
                const newFromSlots = newData[fromIndex].slots.filter(s => s.id !== slot.id);
                newData[fromIndex] = { ...newData[fromIndex], slots: newFromSlots };
            }

            // 2. Add to destination
            const toIndex = newData.findIndex(d => d.auditoriumId === toAuditoriumId);
            if (toIndex >= 0) {
                newData[toIndex] = {
                    ...newData[toIndex],
                    slots: [...newData[toIndex].slots, slot]
                };
            } else {
                // Should ideally exist, but safety net
                newData.push({ auditoriumId: toAuditoriumId, slots: [slot] });
            }

            return { ...prev, data: newData };
        });
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shadow-sm z-30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600 rounded-lg">
                        <Calendar className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                        Smart Cinema Scheduler
                    </h1>
                    <div className="ml-8 flex items-center bg-slate-100 dark:bg-slate-700 rounded-md px-3 py-1.5">
                        <input
                            type="date"
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 text-slate-700 dark:text-slate-200"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Format Filter */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mr-4">
                        {['All', '2D', '3D', 'IMAX'].map(format => (
                            <button
                                key={format}
                                onClick={() => setSelectedFormat(format)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedFormat === format
                                    ? 'bg-white dark:bg-slate-600 text-red-600 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                    }`}
                            >
                                {format}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Copy className="w-4 h-4" />
                        Copy Day
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Repeat className="w-4 h-4" />
                        Repeat Week
                    </button>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-600 mx-2"></div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-red-500/30 transition-all">
                        <Save className="w-4 h-4" />
                        Save Schedule
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Movies */}
                <aside className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col z-20 shadow-xl">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Available Movies</h2>
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-md text-sm ring-2 ring-transparent focus:ring-red-500 transition-all"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {SEED_MOVIES.map(movie => (
                            <DraggableMovie
                                key={movie.id}
                                movie={movie}
                                onDragStart={() => setDraggingMovie(movie)}
                            />
                        ))}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 text-center">
                        Drag movies to the timeline to schedule.
                    </div>
                </aside>

                {/* Timeline Area */}
                <main
                    className="flex-1 overflow-hidden relative"
                    onDragEnd={() => setDraggingMovie(null)}
                >

                    <TimelineGrid
                        auditoriums={filteredAuditoriums}
                        scheduleData={scheduleData}
                        selectedDate={selectedDate}
                        movies={SEED_MOVIES}
                        draggingMovie={draggingMovie}
                        onAddSlot={handleAddSlot}
                        onUpdateSlot={handleUpdateSlot}
                        onDeleteSlot={handleDeleteSlot}
                        onMoveSlot={handleMoveSlot}
                    />
                    <TrashCan onDeleteSlot={handleDeleteSlot} />
                </main>
            </div>
        </div>
    );
};

export default ScheduleManagerPage;
