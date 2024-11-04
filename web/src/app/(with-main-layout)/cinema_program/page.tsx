// app/cinema_program/page.tsx
"use client";
import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { movies } from "@/config/moviesData";

const RepertuarPage: React.FC = () => {
  // Stan dialogu dla wybranego filmu
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

  // Funkcje otwierania i zamykania dialogu
  const handleOpen = (movie: any) => {
    setSelectedMovie(movie);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "lg", padding: 4 }}>
      <Typography variant="h3" gutterBottom>Repertuar Kinowy</Typography>
      <Grid container spacing={4}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card>
              <CardMedia component="img" height="500" image={movie.image} alt={`${movie.title} poster`} />
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{ cursor: "pointer", color: "primary.main" }}
                  onClick={() => handleOpen(movie)}  // Otwieranie dialogu z filmem
                >
                  {movie.title}
                </Typography>
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip label={movie.genre} color="primary" />
                  <Chip label={movie.duration} color="secondary" />
                </Stack>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>Godziny seansów:</Typography>
                <Stack direction="row" spacing={1}>
                  {movie.showtimes.map((time, idx) => (
                    <Chip key={idx} label={time} variant="outlined" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog szczegółów filmu */}
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
                {selectedMovie.showtimes.map((time: string, idx: number) => (
                  <Chip key={idx} label={time} variant="outlined" />
                ))}
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Zamknij</Button>
          <Button variant="contained" color="primary">Zarezerwuj miejsce</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RepertuarPage;


