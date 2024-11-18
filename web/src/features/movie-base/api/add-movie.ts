import { parseFormSubmitResponse } from "@/utils/parse-form-submit-response";
import { AxiosInstance } from "axios";
import { MovieFormData } from "../types/movie";

type BaseFormResponseErrors<T extends object> = {
  [K in keyof T]?: string;
};

interface BaseFormResponse<T extends object, K = {}> {
  success: boolean;
  data?: K;
  errors?: BaseFormResponseErrors<T>;
}

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

  return await parseFormSubmitResponse<MovieFormData>(() =>
    axios.post("/movies/create", formData),
  );
};
