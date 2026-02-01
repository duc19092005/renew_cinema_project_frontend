export interface Movie {
  id: string;
  title: string;
  durationMinutes: number;
  formats: string[]; // e.g., ['2D', '3D', 'IMAX']
  color?: string;
}

export interface Auditorium {
  id: string;
  name: string;
  supportedFormats: string[];
}

export interface ShowTimeSlot {
  id: string; // unique instance id
  movieId: string;
  formatId: string; // e.g., '2D'
  start: string; // ISO8601
  end: string; // ISO8601
  price: number;
}

export interface AuditoriumSchedule {
  auditoriumId: string;
  slots: ShowTimeSlot[];
}

export interface ScheduleData {
  cinemaId: string;
  data: AuditoriumSchedule[];
}

// For Drag & Drop state
export interface DragItem {
  type: 'movie_source' | 'existing_slot';
  movieId?: string; // if from source
  slotId?: string; // if moving existing
  duration?: number;
  format?: string;
}
