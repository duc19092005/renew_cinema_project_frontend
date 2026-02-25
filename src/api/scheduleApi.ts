// src/api/scheduleApi.ts
import { theaterAxios } from './axiosClient';
import type { ApiSuccessResponse } from '../types/auth.types';
import type { CreateScheduleRequest } from '../types/schedule.types';

export const scheduleApi = {
    /** POST /api/TheaterManager/MovieSchedules */
    createSchedule: async (data: CreateScheduleRequest): Promise<ApiSuccessResponse> => {
        const response = await theaterAxios.post<ApiSuccessResponse>(
            '/TheaterManager/MovieSchedules',
            data
        );
        return response.data;
    },
};
