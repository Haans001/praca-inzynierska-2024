import { Repertoire } from "@/features/repertoire/types/types";
import { BaseDataResponse } from "@/types/base-response";
import { AxiosInstance } from "axios";

export interface Showing extends Repertoire {
  bookings: {
    id: number;
    userId: number;
    repertoireId: number;
    seatNumbers: number[];
    createdAt: Date;
  }[];
}

export const getShowingById = async (axios: AxiosInstance, id: string) => {
  const response = await axios.get(`/repertoire?id=${id}`);

  return response.data as BaseDataResponse<Showing>;
};
