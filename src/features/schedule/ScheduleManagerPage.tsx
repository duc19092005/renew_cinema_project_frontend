import React, { useState } from 'react';
import { INITIAL_SCHEDULE, SEED_AUDITORIUMS, SEED_MOVIES } from './data/seed';
import TimelineGrid from './components/TimelineGrid';
import DraggableMovie from './components/DraggableMovie';
import type { Movie, ScheduleData, ShowTimeSlot } from './types';
import { Calendar, Copy, Repeat, Save, Menu, X, Film } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import TrashCan from './components/TrashCan';

interface ScheduleManagerPageProps {
    embedded?: boolean;
}

const ScheduleManagerPage: React.FC<ScheduleManagerPageProps> = ({ embedded = false }) => {
    const { t } = useTranslation();
    const [scheduleData, setScheduleData] = useState<ScheduleData>(INITIAL_SCHEDULE);
    const [draggingMovie, setDraggingMovie] = useState<Movie | null>(null);
    const [selectedAuditoriumId, setSelectedAuditoriumId] = useState<string>(SEED_AUDITORIUMS[0]?.id || '');
    const [selectedDate] = useState<Date>(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Derived state for filtering
    const activeAuditorium = SEED_AUDITORIUMS.find(a => a.id === selectedAuditoriumId);
    const filteredAuditoriums = activeAuditorium ? [activeAuditorium] : [];

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
        <div className={`flex flex-col text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300 ${embedded ? 'flex-1 h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-md' : 'h-screen bg-slate-50 dark:bg-slate-900'}`}>
            {/* Header */}
            <header className={`h-16 flex items-center justify-between px-4 sm:px-6 z-30 transition-colors duration-300 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm w-full shrink-0 overflow-x-auto scrollbar-hide`}>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </button>
                    <div className="p-1.5 sm:p-2 bg-red-600 rounded-lg hidden sm:block">
                        <Calendar className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent hidden sm:block">
                        {t('scheduleManager.title')}
                    </h1>
                </div>

                <div className="flex items-center pl-2 gap-2 sm:gap-3 shrink-0">
                    {/* Auditorium Selector */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1 sm:mr-2">
                        <select
                            className="bg-transparent border-none text-xs sm:text-sm font-bold focus:ring-0 text-slate-700 dark:text-slate-200 py-1 pl-2 pr-8 cursor-pointer"
                            value={selectedAuditoriumId}
                            onChange={(e) => setSelectedAuditoriumId(e.target.value)}
                        >
                            {SEED_AUDITORIUMS.map(aud => (
                                <option key={aud.id} value={aud.id} className="text-slate-900 bg-white dark:text-slate-200 dark:bg-slate-700">{aud.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="hidden lg:block h-6 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    <button
                        className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-lg shadow-red-500/30 transition-all shrink-0"
                        onClick={() => {
                            const slots = scheduleData.data.find(d => d.auditoriumId === selectedAuditoriumId)?.slots || [];
                            const payload = {
                                AuditoriumId: selectedAuditoriumId,
                                Slots: slots.map(s => ({
                                    MovieId: s.movieId,
                                    FormatId: s.formatId,
                                    StartedDate: s.start,
                                    Duration: 120 // Should map movie length
                                }))
                            };
                            console.log("TheaterManagerAddMovieSchedulesRequest:", payload);
                            toast.success(t('scheduleManager.saveSuccess'), { duration: 3000 });
                        }}
                    >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('scheduleManager.save')}</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div
                className="flex flex-1 overflow-hidden relative"
                onDragEnd={() => setDraggingMovie(null)}
            >
                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="absolute inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar - Movies */}
                <aside className={`absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 z-40 w-72 sm:w-80 flex flex-col transition-transform duration-300 ease-in-out bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-2xl md:shadow-xl`}>
                    <div className={`p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between`}>
                        <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                            <Film className="w-4 h-4 text-red-500" />
                            {t('scheduleManager.dragMoviesTitle')}
                        </h2>
                        {isSidebarOpen && (
                            <button className="md:hidden text-slate-400 hover:text-red-500" onClick={() => setIsSidebarOpen(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="p-3">
                        <input
                            type="text"
                            placeholder={t('scheduleManager.search')}
                            className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-md text-sm ring-2 ring-transparent focus:ring-red-500 transition-all text-slate-800 dark:text-slate-200"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {SEED_MOVIES.map(movie => (
                            <DraggableMovie
                                key={movie.id}
                                movie={movie}
                                onDragStart={() => setDraggingMovie(movie)}
                                onDragEnd={() => setDraggingMovie(null)}
                            />
                        ))}
                    </div>

                    <div className={`p-4 border-t text-xs text-slate-500 text-center transition-colors duration-300 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700`}>
                        {t('scheduleManager.dragMoviesDesc')}
                    </div>
                </aside>

                {/* Timeline Area */}
                <main
                    className="flex-1 overflow-hidden relative flex flex-col"
                >

                    <TimelineGrid
                        auditoriums={filteredAuditoriums}
                        scheduleData={scheduleData}
                        selectedDate={selectedDate}
                        movies={SEED_MOVIES}
                        draggingMovie={draggingMovie}
                        onAddSlot={handleAddSlot}
                        onUpdateSlot={handleUpdateSlot}
                        onMoveSlot={handleMoveSlot}
                    />
                    <TrashCan onDeleteSlot={handleDeleteSlot} />
                </main>
            </div>
        </div>
    );
};

export default ScheduleManagerPage;
