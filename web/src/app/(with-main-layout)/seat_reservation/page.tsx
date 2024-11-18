"use client";
import CinemaRoom from "@/components/reservation/cinema_room_view";
import { useUser } from "@clerk/nextjs";
import { Box } from "@mui/material";
import * as React from "react";

export default function SeatReservation() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }
  console.log(user);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        margin: 8,
      }}
    >
      <CinemaRoom />
    </Box>
  );
}
