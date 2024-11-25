import { BaseFormResponse } from "@/types/base-response";
import { AxiosInstance } from "axios";

export interface AddMovieToRepertoireFormData {
  movieId: number;
  startTime: string;
}

export const addMovieToRepertoire = async (
  axios: AxiosInstance,
  data: {
    movieId: number;
    startTime: string;
  },
) => {
  const response = await axios.post<
    BaseFormResponse<AddMovieToRepertoireFormData>
  >("/repertoire/create", data);

  return response.data;
};
