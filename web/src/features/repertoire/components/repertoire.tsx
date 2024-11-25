// app/cinema_program/page.tsx

"use client";
import { RepertoireFormModal } from "@/features/repertoire/components/repertoire-form-modal";
import { useAxios } from "@/hooks/use-axios";
import { useIsAdmin } from "@/hooks/use-is-admin";
import {
  Box,
  Grid2 as Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getRepertoireByDate } from "../api/get-movies-by-date";
import { Repertoire as RepertoireItem } from "../types/types";
import { getNextNDays } from "../utils/getNextNDays";
import { RepertoireItemCard } from "./repertoire-item-card";

export const Repertoire: React.FC = () => {
  const availableDates = getNextNDays(7);

  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates[0] || "",
  );

  const handleDateChange = (event: SelectChangeEvent<string>) => {
    setSelectedDate(event.target.value as string);
  };

  const axios = useAxios();

  const { isAdmin } = useIsAdmin();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["repertoire", { date: selectedDate }],
    queryFn: () => getRepertoireByDate(axios, selectedDate),
  });

  const repertoire = data?.data || [];

  const groupedRepertoire = repertoire.reduce((acc, repertoire) => {
    const title = repertoire.movie.title;

    if (!acc[title]) {
      acc[title] = [];
    }

    acc[title].push(repertoire);

    return acc;
  }, {} as Record<string, RepertoireItem[]>);

  console.log("repertoire", repertoire);

  const shouldShowEmptyState = !isLoading && repertoire.length === 0;

  return (
    <Box sx={{ width: "100%", maxWidth: "lg", padding: 4 }}>
      <Typography variant="h3" gutterBottom>
        Repertuar Kinowy
      </Typography>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Stack direction="row" gap={2} alignItems="center">
          Wybór daty
          <Select value={selectedDate} onChange={handleDateChange}>
            {availableDates.map((date) => (
              <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        {isAdmin ? (
          <Stack justifyContent="center">
            <RepertoireFormModal
              refetchRepertoire={refetch}
              day={new Date(selectedDate)}
            />
          </Stack>
        ) : null}
      </Stack>
      <Grid container spacing={4}>
        {shouldShowEmptyState ? (
          <Typography variant="h5" color="textSecondary">
            Brak seansów w tym dniu
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            {Object.values(groupedRepertoire).map((repertoires) => (
              <RepertoireItemCard
                key={repertoires[0].id}
                repertoires={repertoires}
              />
            ))}
          </Box>
        )}
      </Grid>
    </Box>
  );
};
