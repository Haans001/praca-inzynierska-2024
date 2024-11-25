import { getMovies } from "@/features/movie-base/api/get-movies";
import { useAxios } from "@/hooks/use-axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  MenuItem,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  addMovieToRepertoire,
  AddMovieToRepertoireFormData,
} from "../api/add-movie-to-repertoire";

const schema = z.object({
  movieId: z.number().positive({ message: "Proszę wybrać film" }),
  startTime: z.date(),
});

type FormData = z.infer<typeof schema>;

interface RepertoireFormProps {
  day: Date;
  refetchRepertoire: () => void;
}

export const RepertoireFormModal: React.FC<RepertoireFormProps> = ({
  day,
  refetchRepertoire,
}) => {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      movieId: 0,
      startTime: new Date(day.setHours(12, 0, 0, 0)), // Set default time to noon
    },
  });

  const axios = useAxios();

  const { data, refetch } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => await getMovies(axios),
  });

  const movies = data?.data ?? [];

  const addMovieToRepertoireMutation = useMutation({
    mutationFn: (data: AddMovieToRepertoireFormData) =>
      addMovieToRepertoire(axios, data),
    onSuccess: (data) => {
      if (data.success) {
        refetchRepertoire();
        setOpen(false);
      } else {
        console.log(data.errors);
        if (data.errors) {
          Object.entries(data.errors).forEach(([field, message]) => {
            setError(field as keyof FormData, { message });
          });
        }
      }
    },
  });

  const onSubmit = (data: FormData) => {
    const repertoireDateTime = new Date(day);
    repertoireDateTime.setHours(
      data.startTime.getHours(),
      data.startTime.getMinutes(),
      0,
      0,
    );

    const repertoireData = {
      movieId: data.movieId,
      startTime: repertoireDateTime.toISOString(),
    };

    addMovieToRepertoireMutation.mutate(repertoireData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Dodaj film tego dnia
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Dodaj seans na dzień {day.toLocaleDateString()}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Controller
                name="movieId"
                control={control}
                rules={{ required: "Proszę wybrać film" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Film"
                    error={!!errors.movieId}
                    helperText={errors.movieId?.message}
                    fullWidth
                  >
                    <MenuItem value={0} disabled>
                      Wybierz film
                    </MenuItem>
                    {movies.map((movie) => (
                      <MenuItem key={movie.id} value={movie.id}>
                        {movie.title}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="startTime"
                control={control}
                render={({ field, fieldState }) => (
                  <Box>
                    <TimePicker
                      sx={{
                        width: "100%",
                      }}
                      label="Godzina rozpoczęcia"
                      value={field.value}
                      inputRef={field.ref}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                    />
                    {fieldState.error && (
                      <FormHelperText
                        style={{
                          margin: "0 14px",
                          color: "var(--mui-palette-error-main)",
                        }}
                      >
                        {errors.startTime?.message}
                      </FormHelperText>
                    )}
                  </Box>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Powrót</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={addMovieToRepertoireMutation.isPending}
            >
              Dodaj seans
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};
