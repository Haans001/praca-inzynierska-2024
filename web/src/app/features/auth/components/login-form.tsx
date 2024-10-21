"use client";

import { pages } from "@/config/pages";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Link, TextField, Typography } from "@mui/material";
import { indigo } from "@mui/material/colors";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email jest wymagany").email("Nieprawidłowy email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          marginBottom: "16px",
        }}
      >
        Zaloguj się
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />
        <TextField
          label="Hasło"
          fullWidth
          margin="normal"
          type="password"
          {...register("password")}
          error={!!errors.password}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            background: indigo[500],
            ":hover": { background: indigo[700] },
          }}
        >
          Zaloguj się
        </Button>
      </form>
      <Typography
        variant="body2"
        sx={{
          marginTop: "16px",
        }}
      >
        Nie masz konta?{" "}
        <Link href={pages.auth.signup.route}>Zarejestruj się</Link>
      </Typography>
    </>
  );
};

export default LoginForm;
