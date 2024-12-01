"use client";
import { useAxios } from "@/hooks/use-axios";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import * as React from "react";
import { getUserReservations } from "./api/get-user-reservations";

export const ReservationsPage: React.FC = () => {
  const axios = useAxios();

  const { data } = useQuery({
    queryKey: ["user-reservations"],
    queryFn: () => getUserReservations(axios),
  });

  const reservations = data?.data ?? [];

  const incomingReservations = reservations.filter(
    (reservation) => new Date(reservation.repertoire.startTime) > new Date(),
  );

  const historyReservations = reservations.filter(
    (reservation) => new Date(reservation.repertoire.startTime) < new Date(),
  );

  const renderTable = (children: React.ReactNode) => (
    <TableContainer>
      <Table
        aria-label="Historia"
        sx={{
          width: "90%",
          alignContent: "center",
          tableLayout: "fixed",
        }}
      >
        <TableHead>
          <TableRow sx={{ borderBottom: "1px solid #ccc" }}>
            <TableCell>Dzień</TableCell>
            <TableCell>Godzina</TableCell>
            <TableCell>Seans</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </TableContainer>
  );

  const renderIncomingReservations = () => {
    if (incomingReservations.length === 0) {
      return (
        <Typography sx={{}}>Obecnie brak nadchodzących rezerwacji</Typography>
      );
    }

    return renderTable(
      incomingReservations.map((reservation) => (
        <TableRow key={reservation.id}>
          <TableCell>
            {format(new Date(reservation.repertoire.startTime), "dd.MM.yyyy")}
          </TableCell>
          <TableCell>
            {format(new Date(reservation.repertoire.startTime), "HH:mm")}
          </TableCell>
          <TableCell>{reservation.repertoire.movie.title}</TableCell>
        </TableRow>
      )),
    );
  };

  const renderHistoryReservations = () => {
    if (historyReservations.length === 0) {
      return <Typography>Brak rezerwacji</Typography>;
    }

    return renderTable(
      historyReservations.map((reservation) => (
        <TableRow key={reservation.id}>
          <TableCell>
            {format(new Date(reservation.repertoire.startTime), "dd.MM.yyyy")}
          </TableCell>
          <TableCell>
            {format(new Date(reservation.repertoire.startTime), "HH:mm")}
          </TableCell>
          <TableCell>{reservation.repertoire.movie.title}</TableCell>
        </TableRow>
      )),
    );
  };

  return (
    <Stack
      sx={{
        width: "100%",
      }}
    >
      <Paper
        sx={{
          maxWidth: "100%",
          margin: 0,
          borderLeft: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "20px", padding: 5 }}>
          Rezerwacje
        </Typography>
        <Divider variant="middle" />
        <Box
          sx={{
            paddingX: 5,
            paddingY: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "17px",
              marginBottom: 2,
            }}
          >
            Nadchodzące rezerwacje
          </Typography>
          {renderIncomingReservations()}
        </Box>

        <Divider variant="middle" />
        <Box
          sx={{
            paddingX: 5,
            paddingY: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "17px",
            }}
          >
            Historia rezerwacji
          </Typography>
          {renderHistoryReservations()}
        </Box>
      </Paper>
    </Stack>
  );
};

export default ReservationsPage;
