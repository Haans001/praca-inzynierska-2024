import { AxiosInstance } from "axios";

interface BookSeatsParams {
  showingId: number;
  seatNumbers: number[];
}

export const bookSeats = async (
  axios: AxiosInstance,
  params: BookSeatsParams,
) => {
  const res = await axios.post(`/booking/book-seats`, {
    repertoireId: params.showingId,
    seatNumbers: params.seatNumbers,
  });

  return res.data;
};
