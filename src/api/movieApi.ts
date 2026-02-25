// src/api/movieApi.ts
import { movieAxios } from './axiosClient';
import type { ApiSuccessResponse } from '../types/auth.types';
import type { Movie, MovieRequiredAge, CreateMovieFormData, UpdateMovieFormData } from '../types/movie.types';
import type { MovieFormat } from '../types/facilities.types';

export const movieApi = {
    /** GET /api/movieManager/movies */
    getMovieList: async (): Promise<ApiSuccessResponse<Movie[]>> => {
        const response = await movieAxios.get<ApiSuccessResponse<Movie[]>>(
            '/movieManager/movies'
        );
        return response.data;
    },

    /** GET http://localhost:5032/MovieFormats */
    getMovieFormats: async (): Promise<ApiSuccessResponse<MovieFormat[]>> => {
        // Fetch using absolute URL
        const response = await movieAxios.get<ApiSuccessResponse<MovieFormat[]>>(
            'http://localhost:5032/MovieFormats'
        );
        return response.data;
    },

    /** GET http://localhost:5032/MovieRequiredAge */
    getMovieRequiredAges: async (): Promise<ApiSuccessResponse<MovieRequiredAge[]>> => {
        const response = await movieAxios.get<ApiSuccessResponse<MovieRequiredAge[]>>(
            'http://localhost:5032/MovieRequiredAge'
        );
        return response.data;
    },

    /** GET /api/movieManager/movies/{id} */
    getMovieDetail: async (movieId: string): Promise<ApiSuccessResponse<Movie>> => {
        const response = await movieAxios.get<ApiSuccessResponse<Movie>>(
            `/movieManager/movies/${movieId}`
        );
        return response.data;
    },

    /** POST /api/movieManager/movies (multipart/form-data) */
    createMovie: async (data: CreateMovieFormData): Promise<ApiSuccessResponse> => {
        const formData = new FormData();
        formData.append('movieRequiredAgeId', data.movieRequiredAgeId);
        formData.append('movieName', data.movieName);
        formData.append('movieDescription', data.movieDescription);
        formData.append('movieImage', data.movieImage);
        formData.append('endedDate', data.endedDate);
        formData.append('startedDate', data.startedDate);
        formData.append('duration', data.duration.toString());

        // Append arrays
        data.movieFormatIds.forEach((id) => {
            formData.append('movieFormatIds', id);
        });
        data.movieGenreIds.forEach((id) => {
            formData.append('movieGenreIds', id);
        });

        const response = await movieAxios.post<ApiSuccessResponse>(
            '/movieManager/movies',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /** PUT /api/movieManager/movies/{movieId} (multipart/form-data) */
    updateMovie: async (movieId: string, data: UpdateMovieFormData): Promise<ApiSuccessResponse> => {
        const formData = new FormData();

        if (data.movieRequiredAgeId) formData.append('movieRequiredAgeId', data.movieRequiredAgeId);
        if (data.movieName) formData.append('movieName', data.movieName);
        if (data.movieDescription) formData.append('movieDescription', data.movieDescription);
        if (data.movieImage) formData.append('movieImage', data.movieImage);
        if (data.endedDate) formData.append('endedDate', data.endedDate);
        if (data.startedDate) formData.append('startedDate', data.startedDate);
        if (data.duration !== undefined) formData.append('duration', data.duration.toString());

        if (data.movieFormatIds) {
            data.movieFormatIds.forEach((id) => {
                formData.append('movieFormatIds', id);
            });
        }
        if (data.movieGenreIds) {
            data.movieGenreIds.forEach((id) => {
                formData.append('movieGenreIds', id);
            });
        }

        const response = await movieAxios.put<ApiSuccessResponse>(
            `/movieManager/movies/${movieId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },
};
