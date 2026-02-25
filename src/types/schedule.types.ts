// src/types/schedule.types.ts

// =============================================
// SCHEDULE TYPES (Theater Manager)
// =============================================

/** A single schedule slot for the API payload */
export interface ScheduleSlot {
    scheduleId: string; // Empty GUID "00000000-0000-0000-0000-000000000000" for new slots
    movieId: string;
    formatId: string;
    startedDate: string; // ISO datetime
}

/** POST /api/TheaterManager/MovieSchedules */
export interface CreateScheduleRequest {
    auditoriumId: string;
    slots: ScheduleSlot[];
}
