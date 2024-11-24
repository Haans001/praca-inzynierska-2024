import { Movie } from "@/features/movie-base/types/movie";

export interface Repertoire {
  id: number;
  movieId: number;
  startTime: string;
  endTime: string;
  movie: Movie;
}
