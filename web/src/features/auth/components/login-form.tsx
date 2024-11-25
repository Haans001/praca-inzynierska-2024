"use client";

import { PasswordField } from "@/components/shared/password-field";
import { pages } from "@/config/pages";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Link, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseAuthError } from "../errors/auth-error";

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
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const searchParams = useSearchParams();

  const { signIn, setActive } = useSignIn();

  const handleLogin = async (data: LoginFormData) => {
    if (signIn) {
      const redirectUrl = searchParams.get("redirect_url");

      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push(redirectUrl ?? pages.dashboard.repertoire.route);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    }
  };

  const { mutate: login, isPending } = useMutation({
    mutationFn: handleLogin,
    onError: (err) => {
      const error = parseAuthError(err);

      if (error.code === "form_identifier_not_found") {
        setError("email", {
          type: "manual",
          message: "Konto o podanym adresie e-mail nie istnieje.",
        });
      } else if (error.code == "form_password_incorrect") {
        setError("password", {
          type: "manual",
          message: "Nieprawidłowe hasło.",
        });
      } else if (error.code === "user_locked") {
        setError("email", {
          type: "manual",
          message:
            "Możliwość logowania została zablokowana z powodu zbyt wielu nieudanych prób logowania. Spróbuj ponownie później.",
        });
      }
    },
  });

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
      <form onSubmit={handleSubmit((data) => login(data))}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />
        <PasswordField
          label="Hasło"
          fullWidth
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ""}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
          }}
          disabled={isPending}
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
