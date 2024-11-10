export interface Movie {
  id: string;
  title: string;
  description: string;
  genres: string[];
  length: number;
  image: string;
}

export interface MovieFormData {
  title: string;
  description: string;
  genres: string[];
  length: number;
  image: File | null;
}
