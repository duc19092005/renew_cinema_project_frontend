// src/types/movie.types.ts

// =============================================
// MOVIE TYPES
// =============================================

export interface MovieRequiredAge {
    movieRequiredAgeSymbolId: string;
    movieRequiredAgeSymbol: string;
    movieRequiredAgeDescription: string;
}

/** Movie list item / detail (from GET /api/movieManager/movies) */
export interface Movie {
    movieId: string;
    movieName: string;
    movieDescriptions: string;
    movieImageUrl: string;
    endedDate: string; // ISO datetime
    startedDate: string; // ISO datetime
    movieGenresInfos: string[];
    movieVisualFormatInfos: string[];
    updatedAt: string;
    createdAt: string;
    updatedBy: string;
    createdBy: string;
    duration: number; // minutes
}

/** POST /api/movieManager/movies — multipart/form-data */
export interface CreateMovieFormData {
    movieRequiredAgeId: string;
    movieName: string;
    movieDescription: string;
    movieImage: File;
    endedDate: string; // ISO datetime
    startedDate: string; // ISO datetime
    movieFormatIds: string[];
    movieGenreIds: string[];
    duration: number;
}

/** PUT /api/movieManager/movies/{movieId} — multipart/form-data */
export interface UpdateMovieFormData {
    movieRequiredAgeId?: string;
    movieName?: string;
    movieDescription?: string;
    movieImage?: File;
    endedDate?: string;
    startedDate?: string;
    movieFormatIds?: string[];
    movieGenreIds?: string[];
    duration?: number;
}
