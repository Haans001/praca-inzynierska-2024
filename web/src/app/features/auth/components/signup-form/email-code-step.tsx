"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const emailCodeSchema = z.object({
  code: z.string().min(1, "Kod jest wymagany."),
});

type EmailCodeStepFormData = z.infer<typeof emailCodeSchema>;

export const EmailCodeStep: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailCodeStepFormData>({
    resolver: zodResolver(emailCodeSchema),
  });

  const onSubmit = (data: EmailCodeStepFormData) => {
    console.log(data);
  };

  return (
    <>
      <Stack gap="4px">
        <Typography variant="h5">Wprowadź kod</Typography>
        <Typography variant="body2">
          Na twój email wysłaliśmy kod werfyikacyjny. Wprowadź go poniżej aby
          dokończyć rejestrację.
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Kod"
          fullWidth
          margin="normal"
          {...register("code")}
          error={!!errors.code}
          helperText={errors.code ? errors.code.message : ""}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Zweryfikuj kod
        </Button>
      </form>
    </>
  );
};
