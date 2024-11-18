"use client";

import { useAxios } from "@/hooks/use-axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addMovie } from "../api/add-movie";
import { getMovies } from "../api/get-movies";
import { MovieFormData } from "../types/movie";

const genres = [
  "Akcja",
  "Przygodowy",
  "Komedia",
  "Kryminalny",
  "Dramat",
  "Fantasy",
  "Historyczny",
  "Horror",
  "Mystery",
  "Romans",
  "Science Fiction",
  "Thriller",
  "Western",
];

export const MovieDatabase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const axios = useAxios();

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => await getMovies(axios),
  });

  const addMovieMutation = useMutation({
    mutationFn: (data: MovieFormData) => addMovie(axios, data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["movies"] });
        setIsModalOpen(false);
      } else {
        console.log(data.errors);
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            setError(field as keyof MovieFormData, { message });
          });
        }
      }
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MovieFormData>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMovies = () => {
    const movies = data?.data;

    if (isLoading) {
      return "Ładowanie...";
    }

    if (error) {
      return "Wystąpił błąd";
    }

    console.log(movies);

    if (movies && movies.length > 0) {
      return (
        <Stack spacing={2} direction="column">
          {movies.map((movie) => (
            <Card>
              <Stack direction="row" p={2}>
                <CardMedia
                  component="img"
                  image={movie.imageUrl}
                  alt={`${movie.title} poster`}
                  sx={{
                    width: 150,
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: "primary.main" }}
                  >
                    {movie.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="p"
                    gutterBottom
                    mb={4}
                  >
                    {movie.description}
                  </Typography>
                  <Stack direction="row" spacing={1} mb={2}>
                    {movie.genres.map((genre) => (
                      <Chip key={genre} label={genre} color="primary" />
                    ))}
                  </Stack>
                  <Chip
                    label={`${movie.lengthInMinutes} minut`}
                    color="secondary"
                  />
                </CardContent>
              </Stack>
            </Card>
          ))}
        </Stack>
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ marginBottom: 2 }}
      >
        <Typography variant="h4">Baza filmów</Typography>
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          sx={{ marginBottom: 2 }}
        >
          Dodaj film
        </Button>
      </Stack>
      {renderMovies()}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Dodaj film</DialogTitle>
        <form
          onSubmit={handleSubmit(
            (data) => addMovieMutation.mutate(data),
            (error) => {
              console.log(error);
            },
          )}
        >
          <DialogContent>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tytuł"
                  fullWidth
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Opis"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
            <Controller
              name="genres"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    displayEmpty
                    sx={{
                      width: "100%",
                    }}
                    error={!!errors.genres}
                    multiple
                    input={<OutlinedInput />}
                    renderValue={(selected) =>
                      selected.length > 0 ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            color: "rgba(0, 0, 0, 0.54)",
                          }}
                        >
                          Gatunki
                        </Typography>
                      )
                    }
                  >
                    {genres.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.genres ? (
                    <FormHelperText
                      style={{
                        margin: "0 14px",
                        color: "var(--mui-palette-error-main)",
                      }}
                    >
                      {errors.genres?.message}
                    </FormHelperText>
                  ) : null}
                </>
              )}
            />
            <Controller
              name="lengthInMinutes"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Długość w minutach"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.lengthInMinutes}
                  helperText={errors.lengthInMinutes?.message}
                />
              )}
            />
            <Controller
              name="image"
              control={control}
              defaultValue={null}
              render={({ field: { onChange, value, ...field } }) => (
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      onChange(e.target.files?.[0] || null);
                      handleImageChange(e);
                    }}
                    style={{ display: "none" }}
                    id="image-upload"
                    {...field}
                  />
                  <label htmlFor="image-upload">
                    <Button variant="contained" component="span">
                      Dodaj obrazek
                    </Button>
                  </label>
                  {errors.image && (
                    <FormHelperText
                      style={{
                        margin: "3px 14px 0 14px",
                        color: "var(--mui-palette-error-main)",
                      }}
                    >
                      {errors.image?.message}
                    </FormHelperText>
                  )}
                  {previewImage && (
                    <Box mt={2}>
                      <img src={previewImage} alt="Preview" width={200} />
                    </Box>
                  )}
                </Box>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Wyjdź</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addMovieMutation.isPending}
            >
              Dodaj film
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
