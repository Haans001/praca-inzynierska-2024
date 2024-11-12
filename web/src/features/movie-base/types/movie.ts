export interface Movie {
  id: string;
  title: string;
  description: string;
  genres: string[];
  lengthInMinutes: number;
  imageUrl: string;
}

export interface MovieFormData {
  title: string;
  description: string;
  genres: string[];
  lengthInMinutes: number;
  image: File | null;
}
