import type { Auditorium, Movie, ScheduleData } from "../types";

export const SEED_MOVIES: Movie[] = [
    { id: 'm1', title: 'Avatar: The Way of Water', durationMinutes: 192, formats: ['2D', '3D', 'IMAX'], color: '#3b82f6' },
    { id: 'm2', title: 'Oppenheimer', durationMinutes: 180, formats: ['2D', 'IMAX'], color: '#f97316' },
    { id: 'm3', title: 'Barbie', durationMinutes: 114, formats: ['2D'], color: '#ec4899' },
    { id: 'm4', title: 'Dune: Part Two', durationMinutes: 166, formats: ['2D', 'IMAX'], color: '#d97706' },
    { id: 'm5', title: 'Kung Fu Panda 4', durationMinutes: 94, formats: ['2D', '3D'], color: '#ef4444' },
];

export const SEED_AUDITORIUMS: Auditorium[] = [
    { id: 'a1', name: 'Hall 1 (IMAX)', supportedFormats: ['2D', '3D', 'IMAX'] },
    { id: 'a2', name: 'Hall 2 (Standard)', supportedFormats: ['2D', '3D'] },
    { id: 'a3', name: 'Hall 3 (Gold)', supportedFormats: ['2D'] },
    { id: 'a4', name: 'Hall 4 (Standard)', supportedFormats: ['2D', '3D'] },
];

export const INITIAL_SCHEDULE: ScheduleData = {
    cinemaId: 'cinema-1',
    data: [
        {
            auditoriumId: 'a1',
            slots: []
        },
        {
            auditoriumId: 'a2',
            slots: []
        },
        {
            auditoriumId: 'a3',
            slots: []
        },
        {
            auditoriumId: 'a4',
            slots: []
        }
    ]
};
