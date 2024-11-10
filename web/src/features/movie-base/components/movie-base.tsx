"use client";

import { useAxios } from "@/hooks/use-axios";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addMovie } from "../api/add-movie";
import { Movie, MovieFormData } from "../types/movie";

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Historical",
  "Horror",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Western",
];

export const MovieBase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const axios = useAxios();

  console.log(axios.defaults.baseURL);

  const movies: Movie[] = [];

  const addMovieMutation = useMutation({
    mutationFn: (data: MovieFormData) => addMovie(axios, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setIsModalOpen(false);
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<MovieFormData>({});

  const onSubmit = async (data: MovieFormData) => {
    console.log(data);
    try {
      await addMovieMutation.mutateAsync(data);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        // const errorData = JSON.parse(error.message);
        // Object.keys(errorData).forEach((key) => {
        //   setError(key as keyof MovieFormData, {
        //     type: "manual",
        //     message: errorData[key],
        //   });
        // });
      }
    }
  };

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

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Baza filmów
      </Typography>
      <Button
        variant="contained"
        onClick={() => setIsModalOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Dodaj film
      </Button>

      <List>
        {movies?.map((movie) => (
          <ListItem key={movie.id} divider>
            <Image
              src={movie.image}
              alt={movie.title}
              width={50}
              height={75}
              style={{ marginRight: 16 }}
            />
            <ListItemText
              primary={movie.title}
              secondary={
                <>
                  <Typography variant="body2">{movie.description}</Typography>
                  <Typography variant="body2">
                    Length: {movie.length} minutes
                  </Typography>
                  <Box>
                    {movie.genres.map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        size="small"
                        sx={{ marginRight: 0.5 }}
                      />
                    ))}
                  </Box>
                </>
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Dodaj film</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
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
                  label="Description"
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
                <Select
                  {...field}
                  displayEmpty
                  multiple
                  sx={{
                    width: "100%",
                  }}
                  input={<OutlinedInput />}
                  renderValue={(selected) =>
                    selected.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
              )}
            />
            <Controller
              name="length"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Length (minutes)"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.length}
                  helperText={errors.length?.message}
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
                    <Typography color="error">
                      {errors.image.message}
                    </Typography>
                  )}
                  {previewImage && (
                    <Box mt={2}>
                      <Image
                        src={previewImage}
                        alt="Preview"
                        width={100}
                        height={150}
                        objectFit="cover"
                      />
                    </Box>
                  )}
                </Box>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Dodaj film
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
