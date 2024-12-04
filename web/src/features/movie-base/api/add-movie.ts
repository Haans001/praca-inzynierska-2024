import { BaseFormResponse } from "@/types/base-response";
import { AxiosInstance } from "axios";
import { MovieFormData } from "../types/movie";

export const addMovie = async (axios: AxiosInstance, data: MovieFormData) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append(
    "genres",
    `[${data.genres.map((genre) => `"${genre}"`).join(",")}]`,
  );
  formData.append("lengthInMinutes", data.lengthInMinutes.toString());
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await axios.post<BaseFormResponse<MovieFormData>>(
    "/movies/create",
    formData,
  );

  return response.data;
};
