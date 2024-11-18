import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export const useAxios = () => {
  const { getToken } = useAuth();
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  instance.interceptors.request.use(
    async (req) => {
      req.headers.Authorization = `Bearer ${await getToken()}`;
      return req;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};
