// src/api/facilitiesApi.ts
import axios from 'axios';
import type { ApiSuccessResponse } from '../types/auth.types';

export interface Cinema {
  cinemaId?: string;
  cinemaName: string;
  cinemaDescription: string;
  cinemaHotlineNumber: string;
  cinemaLocation: string;
  totalRooms: number;
}

export interface Room {
  roomId?: string;
  roomName: string;
  roomCapacity: number;
  roomStatus?: string; // 'active' | 'maintenance' | 'inactive'
  cinemaId?: string;
}

// Tạo axios instance riêng cho API facilities (endpoint: http://localhost:5032/api/facilities/cinema)
const facilitiesAxiosClient = axios.create({
  baseURL: 'http://localhost:5032/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Quan trọng: gửi cookie để authentication
  timeout: 10000,
});

export const facilitiesApi = {
  getCinemaList: async (): Promise<ApiSuccessResponse<Cinema[]>> => {
    const response = await facilitiesAxiosClient.get<ApiSuccessResponse<Cinema[]>>(
      '/facilities/cinema'
    );
    return response.data;
  },
  getCinemaDetail: async (cinemaId: string): Promise<ApiSuccessResponse<Cinema>> => {
    const response = await facilitiesAxiosClient.get<ApiSuccessResponse<Cinema>>(
      `/facilities/cinema/${cinemaId}`
    );
    return response.data;
  },
  getCinemaRooms: async (cinemaId: string): Promise<ApiSuccessResponse<Room[]>> => {
    const response = await facilitiesAxiosClient.get<ApiSuccessResponse<Room[]>>(
      `/facilities/cinema/${cinemaId}/rooms`
    );
    return response.data;
  },
  getRoomDetail: async (roomId: string): Promise<ApiSuccessResponse<Room>> => {
    const response = await facilitiesAxiosClient.get<ApiSuccessResponse<Room>>(
      `/facilities/room/${roomId}`
    );
    return response.data;
  },
};
