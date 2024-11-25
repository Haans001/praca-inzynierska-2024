// app/cinema_program/page.tsx

"use client";
import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { movies } from "@/config/moviesData";
import { showtimes, ShowtimeEntry } from "@/config/showtimesData";

const RepertuarPage: React.FC = () => {
  // pobieranie dat
  const getAvailableDates = (): string[] => {
    const allDates = showtimes.flatMap(entry => Object.keys(entry.dates));
    return Array.from(new Set(allDates));
  };

  const availableDates = getAvailableDates();

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0] || "");
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

  const handleDateChange = (event: SelectChangeEvent<string>) => {
    setSelectedDate(event.target.value as string);
  };

  const handleOpen = (movie: any) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
  };

  const getShowtimesForDate = (movieId: string): string[] => {
    const showtimeEntry: ShowtimeEntry | undefined = showtimes.find((entry) => entry.movieId === movieId);
    return showtimeEntry?.dates[selectedDate] || [];
  };

  const reservationPage = () => {
    window.location.href = './seat_reservation'
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "lg", padding: 4 }}>
      <Typography variant="h3" gutterBottom>Repertuar Kinowy</Typography>

      Wybór daty
      <Select value={selectedDate} onChange={handleDateChange} sx={{ marginBottom: 3 }}>
        {availableDates.map((date) => (
          <MenuItem key={date} value={date}>{date}</MenuItem>
        ))}
      </Select>

      <Grid container spacing={4}>
        {movies.map((movie) => {
          const showtimesForDate = getShowtimesForDate(movie.id);
          if (showtimesForDate.length === 0) return null; // ukryte filmy bez seansów

          return (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card>
                <CardMedia component="img" height="500" image={movie.image} alt={`${movie.title} poster`} />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom sx={{ cursor: "pointer", color: "primary.main" }} onClick={() => handleOpen(movie)}>
                    {movie.title}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={2}>
                    <Chip label={movie.genre} color="primary" />
                    <Chip label={movie.duration} color="secondary" />
                  </Stack>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>Godziny seansów:</Typography>
                  <Stack direction="row" spacing={1}>
                    {showtimesForDate.map((time, idx) => (
                      <Chip key={idx} label={time} variant="outlined" />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      //szczegoly
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedMovie?.title}</DialogTitle>
        <DialogContent>
          {selectedMovie && (
            <>
              <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
                <img src={selectedMovie.image} alt={`${selectedMovie.title} poster`} style={{ width: 150, height: 200, marginRight: 20 }} />
                <Box>
                  <Typography variant="body1" gutterBottom>{selectedMovie.description}</Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label={selectedMovie.genre} color="primary" />
                    <Chip label={selectedMovie.duration} color="secondary" />
                  </Stack>
                </Box>
              </Box>
              <Typography variant="subtitle1" gutterBottom>Godziny seansów:</Typography>
              <Stack direction="row" spacing={1} mb={2}>
                {getShowtimesForDate(selectedMovie.id).map((time: string, idx: number) => (
                  <Chip key={idx} label={time} variant="outlined" />
                ))}
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Zamknij</Button>
          <Button onClick={reservationPage} variant="contained" color="primary">Zarezerwuj miejsce</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RepertuarPage;

