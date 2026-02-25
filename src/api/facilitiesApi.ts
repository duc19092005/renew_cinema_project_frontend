// src/api/facilitiesApi.ts
import { facilitiesAxios } from './axiosClient';
import type { ApiSuccessResponse } from '../types/auth.types';
import type {
  Cinema,
  CreateCinemaRequest,
  UpdateCinemaRequest,
  Auditorium,
  AuditoriumDetail,
  CreateAuditoriumRequest,
  UpdateAuditoriumRequest,
  MovieFormat,
} from '../types/facilities.types';

// Re-export types for backward compatibility
export type {
  Cinema,
  CreateCinemaRequest,
  UpdateCinemaRequest,
  Auditorium,
  AuditoriumDetail,
  CreateAuditoriumRequest,
  UpdateAuditoriumRequest,
  MovieFormat,
};
import type { SeatInfo } from '../types/facilities.types';
export type Room = AuditoriumDetail;
export type SeatPosition = SeatInfo;

export const facilitiesApi = {
  // =============================================
  // CINEMA APIs
  // =============================================

  /** GET /api/facilities/cinema */
  getCinemaList: async (): Promise<ApiSuccessResponse<Cinema[]>> => {
    const response = await facilitiesAxios.get<ApiSuccessResponse<Cinema[]>>(
      '/facilities/cinema'
    );
    return response.data;
  },

  /** GET /api/facilities/cinema/{id} */
  getCinemaDetail: async (cinemaId: string): Promise<ApiSuccessResponse<Cinema>> => {
    const response = await facilitiesAxios.get<ApiSuccessResponse<Cinema>>(
      `/facilities/cinema/${cinemaId}`
    );
    return response.data;
  },

  /** POST /api/facilities/cinema */
  createCinema: async (data: CreateCinemaRequest): Promise<ApiSuccessResponse> => {
    const response = await facilitiesAxios.post<ApiSuccessResponse>(
      '/facilities/cinema',
      data
    );
    return response.data;
  },

  /** PUT /api/facilities/cinema/{cinemaId} */
  updateCinema: async (cinemaId: string, data: UpdateCinemaRequest): Promise<ApiSuccessResponse> => {
    const response = await facilitiesAxios.put<ApiSuccessResponse>(
      `/facilities/cinema/${cinemaId}`,
      data
    );
    return response.data;
  },

  // =============================================
  // AUDITORIUM APIs
  // =============================================

  /** GET /api/facilities/auditorium */
  getAllAuditoriums: async (): Promise<ApiSuccessResponse<Auditorium[]>> => {
    const response = await facilitiesAxios.get<ApiSuccessResponse<Auditorium[]>>(
      '/facilities/auditorium'
    );
    return response.data;
  },

  /** GET /api/facilities/auditorium/{id} */
  getAuditoriumDetail: async (auditoriumId: string): Promise<ApiSuccessResponse<AuditoriumDetail>> => {
    const response = await facilitiesAxios.get<ApiSuccessResponse<AuditoriumDetail>>(
      `/facilities/auditorium/${auditoriumId}`
    );
    return response.data;
  },

  /** GET /api/facilities/auditorium/cinema/{id} */
  getAuditoriumsByCinema: async (cinemaId: string): Promise<ApiSuccessResponse<Auditorium[]>> => {
    const response = await facilitiesAxios.get<ApiSuccessResponse<Auditorium[]>>(
      `/facilities/auditorium/cinema/${cinemaId}`
    );
    return response.data;
  },

  /** POST /api/facilities/auditorium */
  createAuditorium: async (data: CreateAuditoriumRequest): Promise<ApiSuccessResponse> => {
    const response = await facilitiesAxios.post<ApiSuccessResponse>(
      '/facilities/auditorium',
      data
    );
    return response.data;
  },

  /** PUT /api/facilities/auditorium/{id} */
  updateAuditorium: async (auditoriumId: string, data: UpdateAuditoriumRequest): Promise<ApiSuccessResponse> => {
    const response = await facilitiesAxios.put<ApiSuccessResponse>(
      `/facilities/auditorium/${auditoriumId}`,
      data
    );
    return response.data;
  },

  // =============================================
  // MOVIE FORMAT APIs
  // =============================================

  /** GET /api/facilities/movie-format */
  getMovieFormats: async (): Promise<ApiSuccessResponse<MovieFormat[]>> => {
    const response = await facilitiesAxios.get<ApiSuccessResponse<MovieFormat[]>>(
      '/facilities/movie-format'
    );
    return response.data;
  },
};
