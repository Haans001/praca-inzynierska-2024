"use client";

import { useAxios } from "@/hooks/use-axios";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { getShowingById } from "../api/get-showing-by-id";
import CinemaRoom from "./cinema-room";

export const Reservation: React.FC = () => {
  const axios = useAxios();

  const showingId = useSearchParams().get("showingId");

  const { data } = useQuery({
    queryFn: () => getShowingById(axios, showingId!),
    queryKey: ["showing", showingId],
    enabled: !!showingId,
  });

  const showing = data?.data;

  return showing ? <CinemaRoom showing={showing} /> : null;
};

export default Reservation;
