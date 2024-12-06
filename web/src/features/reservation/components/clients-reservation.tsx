"use client";

import * as React from "react";
import { Box, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import { getNextNDays } from "@/features/repertoire/utils/getNextNDays";
import { useAxios } from "@/hooks/use-axios";
import { useQuery } from "@tanstack/react-query";
import { getRepertoireByDate } from "@/features/repertoire/api/get-movies-by-date";
import { Repertoire as RepertoireItem } from "../../repertoire/types/types";
import { RepertoireCard } from "./repertoire-card";

export const ClientsReservation: React.FC = () => {
    const availableDates = getNextNDays(7);

    const [selectedDate, setSelectedDate] = React.useState<string>(
      availableDates[0] || "",
    );
  
    const handleDateChange = (event: SelectChangeEvent<string>) => {
      setSelectedDate(event.target.value as string);
    };
  
    const axios = useAxios();
  
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
    
  return(
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
        <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{ marginBottom: 2 }}
        >
            <Typography variant="h4">Rezerwacje klientów</Typography>
            <Stack direction="row" gap={2} alignItems="center">
            Wybierz datę
            <Select value={selectedDate} onChange={handleDateChange}>
                {availableDates.map((date) => (
                <MenuItem key={date} value={date}>
                    {date}
                </MenuItem>
                ))}
            </Select>
            </Stack>
        </Stack>
        {shouldShowEmptyState ? (
          <Typography variant="h5" color="textSecondary">
            Brak seansów w tym dniu
          </Typography>
        ) : (
            <Typography variant="h5">
                Wybierz godzinę seansu, aby zobaczyć rezerwacje
            </Typography>
        )
        }    
        <Stack>
        <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            {Object.values(groupedRepertoire).map((repertoires) => (
              <RepertoireCard
                key={repertoires[0].id}
                repertoires={repertoires}
              />
            ))}
          </Box>
        </Stack>
     
    </Box>
  );
};

export default ClientsReservation;

