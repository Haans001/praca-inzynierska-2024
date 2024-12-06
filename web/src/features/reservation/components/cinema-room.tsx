"use client";

import { pages } from "@/config/pages";
import { useAxios } from "@/hooks/use-axios";
import { useUser } from "@clerk/nextjs";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import * as React from "react";
import { bookSeats } from "../api/book-seat";
import { Showing } from "../api/get-showing-by-id";

type Seat = {
  id: number;
  row: number;
  number: number;
  isOccupied: boolean;
  isSelected: boolean;
};

interface CinemaRoomProps {
  showing: Showing;
}

const TOTAL_SEATS = 48;
const MAX_SELECTED_SEATS = 5;

export const CinemaRoom: React.FC<CinemaRoomProps> = ({ showing }) => {
  const { user } = useUser();

  const userId = user?.publicMetadata.databaseID;

  if (!userId) {
    return null;
  }

  const userOccupiedSeats = showing.bookings
    .filter((booking) => booking.userId === +userId)
    .flatMap((booking) => booking.seatNumbers);

  const occupiedSeats = showing.bookings.flatMap(
    (booking) => booking.seatNumbers,
  );

  const [selectedSeats, setSelectedSeats] = React.useState<number[]>([]);

  const isOccupied = (id: number) => occupiedSeats.includes(id);

  const isSelected = (id: number) => selectedSeats.includes(id);

  const isOccupiedByUser = (id: number) => userOccupiedSeats.includes(id);

  const toggleSeatSelection = (id: number) => {
    if (isOccupied(id)) {
      return;
    }

    if (isSelected(id)) {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.filter((seatId) => seatId !== id),
      );
    } else if (
      selectedSeats.length + userOccupiedSeats.length <
      MAX_SELECTED_SEATS
    ) {
      setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, id]);
    }
  };

  const axios = useAxios();

  const [seatsBooked, setSeatsBooked] = React.useState(false);

  const bookSeatsMutation = useMutation({
    mutationFn: () =>
      bookSeats(axios, {
        showingId: showing.id,
        seatNumbers: selectedSeats,
      }),
    onSuccess: () => {
      setSeatsBooked(true);
    },
  });

  const userTotalSeatsCount = userOccupiedSeats.length + selectedSeats.length;

  const selectedSeatsLabels = selectedSeats.map((seatId) => {
    const row = Math.floor(seatId / 8) + 1;
    const number = seatId % 8 === 0 ? 8 : seatId % 8;

    return `Rząd ${row}, Miejsce ${number}`;
  });

  if (seatsBooked) {
    return (
      <Stack mt={4} direction="column" alignItems="center">
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          alignItems="center"
        >
          Rezerwacja zakończona
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={pages.dashboard.profile.route}
        >
          Zobacz swoje rezerwacje
        </Button>
      </Stack>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        {showing.movie.title} - {format(new Date(showing.startTime), "HH:mm")}.
        Wybierz miejsca
      </Typography>
      <Stack justifyContent="space-between" direction="row">
        <Stack>
          <Typography variant="body1" gutterBottom>
            Pozostało miejsc: {MAX_SELECTED_SEATS - userTotalSeatsCount}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Wybrane miejsca:
          </Typography>
          <Stack>
            {selectedSeatsLabels.map((label) => (
              <Typography key={label} variant="body2">
                {label}
              </Typography>
            ))}
          </Stack>
        </Stack>
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={
              selectedSeats.length === 0 ||
              userTotalSeatsCount > MAX_SELECTED_SEATS ||
              occupiedSeats.length === TOTAL_SEATS ||
              bookSeatsMutation.isPending
            }
            onClick={() => {
              console.log("bookSeatsMutation.mutate()");
              bookSeatsMutation.mutate();
            }}
          >
            Zarezerwuj
          </Button>
        </Box>
      </Stack>

      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2d6091",
          borderRadius: "5px",
          padding: "15px",
          marginTop: "50px",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            height: "25px",
            backgroundColor: "white",
            borderRadius: "2px",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
          }}
        >
          EKRAN
        </Stack>
        <Stack
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          {Array.from({
            length: TOTAL_SEATS,
          }).map((_, idx) => {
            const seatId = idx + 1;

            return (
              <Box
                sx={{
                  display: "flex", 
                  alignItems: "center",
                }}
              >
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end", 
                  marginRight: "10px", 
                }}
              >
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "black",
                      height: "60px", 
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {seatId % 8 === 1 ? Math.floor(seatId / 8) + 1 : ""}
                  </Typography>
              </Stack>
              <Button
                key={seatId}
                sx={{
                  width: "20px",
                  height: "60px",
                  borderTopLeftRadius: "25px",
                  borderTopRightRadius: "25px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  color: "black",
                  backgroundColor: isOccupiedByUser(seatId)
                    ? "#ff9800"
                    : isOccupied(seatId)
                    ? "#d63a3a"
                    : isSelected(seatId)
                    ? "#4299e1"
                    : "#48bb78",
                  "&:hover": {
                    backgroundColor: isOccupied(seatId)
                      ? "#d63a3a"
                      : isSelected(seatId)
                      ? "#2666a3"
                      : "#3182ce",
                  },
                  "&:disabled": {
                    cursor: "not-allowed",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
                onClick={() => toggleSeatSelection(seatId)}
                disabled={isOccupied(seatId)}
              >
                {seatId % 8 === 0 ? 8 : seatId % 8}
              </Button> 
              </Box>
            );
          })}
        </Stack>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {[
            { color: "#48bb78", label: "Dostępne" },
            { color: "#4299e1", label: "Wybrane" },
            { color: "#d63a3a", label: "Zajęte" },
            { color: "#ff9800", label: "Twoje" },
          ].map(({ color, label }) => (
            <Stack key={label} sx={{ display: "flex", alignItems: "center" }}>
              <Stack
                sx={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: color,
                  borderRadius: "2px",
                  marginRight: "5px",
                }}
              ></Stack>
              <Box component="div" sx={{ display: "inline" }}>
                {label}
              </Box>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default CinemaRoom;
