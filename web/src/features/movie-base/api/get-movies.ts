import { BaseDataResponse } from "@/types/base-response";
import { AxiosInstance } from "axios";
import { Movie } from "../types/movie";

export const getMovies = async (axios: AxiosInstance) => {
  const response = await axios.get("/movies");

  return response.data as BaseDataResponse<Movie[]>;
};
