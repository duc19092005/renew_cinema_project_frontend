import type { AuditoriumSchedule, ShowTimeSlot } from './types';

export const START_HOUR = 8;
export const END_HOUR = 24;
export const TOTAL_HOURS = END_HOUR - START_HOUR;
export const PIXELS_PER_HOUR = 60; // 1 min = 1px for high resolution, or 1 hour = 100px? Let's say 1 hour = 120px (2px per min) for better granularity
export const PIXELS_PER_MIN = 2;

export const getPixelsFromTime = (dateStr: string): number => {
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (hours < START_HOUR) return 0; // Or handle previous day? For now assume single day view logic mostly
    if (hours >= END_HOUR && minutes > 0) return TOTAL_HOURS * 60 * PIXELS_PER_MIN;

    const totalMinutesFromStart = (hours - START_HOUR) * 60 + minutes;
    return totalMinutesFromStart * PIXELS_PER_MIN;
};

export const getTimeFromPixels = (pixels: number, baseDate: Date): Date => {
    const minutesFromStart = Math.round(pixels / PIXELS_PER_MIN);
    const totalMinutes = (START_HOUR * 60) + minutesFromStart;

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
};

export const checkCollision = (
    newStart: Date,
    newEnd: Date,
    existingSlots: ShowTimeSlot[],
    excludeSlotId?: string
): boolean => {
    const newStartMs = newStart.getTime();
    const newEndMs = newEnd.getTime();

    return existingSlots.some(slot => {
        if (slot.id === excludeSlotId) return false;

        const slotStart = new Date(slot.start).getTime();
        const slotEnd = new Date(slot.end).getTime();

        // (StartA < EndB) && (EndA > StartB)
        return (newStartMs < slotEnd) && (newEndMs > slotStart);
    });
};

export const calculateEndTime = (startDate: Date, durationMinutes: number, cleaningTimeMinutes: number = 20): Date => {
    return new Date(startDate.getTime() + (durationMinutes + cleaningTimeMinutes) * 60000);
};

// Helper for formatting
export const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};
