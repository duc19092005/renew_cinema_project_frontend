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

export interface CreateCinemaRequest {
  cinemaName: string;
  cinemaDescription: string;
  cinemaHotlineNumber: string;
  cinemaLocation: string;
  activeAt?: string | null; // ISO date string, optional - có thể null
}

export interface Room {
  roomId?: string;
  roomName: string;
  roomCapacity: number;
  roomStatus?: string; // 'active' | 'maintenance' | 'inactive'
  cinemaId?: string;
}

export interface MovieFormat {
  formatId: string;
  formatName: string;
  formatDescription: string;
  movieFormatPrice: number;
}

export interface SeatPosition {
  seatNumber: string;
  coordX: number;
  coordY: number;
  colIndex: number;
  rowIndex: number;
}

export interface CreateAuditoriumRequest {
  auditoriumNumber: string;
  movieFormatId: string;
  cinemaId: string;
  add_req_seats_auditorium_dto: SeatPosition[];
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
  getMovieFormats: async (): Promise<ApiSuccessResponse<MovieFormat[]>> => {
    const response = await facilitiesAxiosClient.get<ApiSuccessResponse<MovieFormat[]>>(
      '/facilities/movie-format'
    );
    return response.data;
  },
  createCinema: async (data: CreateCinemaRequest): Promise<ApiSuccessResponse<Cinema | null>> => {
    const response = await facilitiesAxiosClient.post<ApiSuccessResponse<Cinema | null>>(
      '/facilities/cinema',
      data
    );
    return response.data;
  },
  createAuditorium: async (data: CreateAuditoriumRequest): Promise<ApiSuccessResponse<Room | null>> => {
    const response = await facilitiesAxiosClient.post<ApiSuccessResponse<Room | null>>(
      '/facilities/auditorium',
      data
    );
    return response.data;
  },
};
