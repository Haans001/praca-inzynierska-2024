import { Repertoire } from "@/features/repertoire/types/types";
import { BaseDataResponse } from "@/types/base-response";
import { AxiosInstance } from "axios";

interface UserReservation {
  id: number;
  repertoireId: number;
  userId: number;
  repertoire: Repertoire;
}

export const getUserReservations = async (axios: AxiosInstance) => {
  const response = await axios.get(`/booking/user-bookings`);

  return response.data as BaseDataResponse<UserReservation[]>;
};
