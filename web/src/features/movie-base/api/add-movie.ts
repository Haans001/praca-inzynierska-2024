import { AxiosInstance } from "axios";
import { MovieFormData } from "../types/movie";

export const addMovie = (axios: AxiosInstance, data: MovieFormData) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append(
    "genres",
    `[${data.genres.map((genre) => `"${genre}"`).join(",")}]`,
  );
  formData.append("length", data.length.toString());
  if (data.image) {
    formData.append("image", data.image);
  }

  return axios.post("/movies/create", formData);
};
