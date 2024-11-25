import { BaseDataResponse } from "@/types/base-response";
import { AxiosInstance } from "axios";
import { Repertoire } from "../types/types";

export const getRepertoireByDate = async (
  axios: AxiosInstance,
  date: string,
) => {
  const response = await axios.get(`/repertoire/by-date?date=${date}`);

  return response.data as BaseDataResponse<Repertoire[]>;
};
