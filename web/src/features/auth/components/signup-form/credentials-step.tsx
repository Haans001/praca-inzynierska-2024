"use client";

import { PasswordField } from "@/components/shared/password-field";
import { pages } from "@/config/pages";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseAuthError } from "../../errors/auth-error";
import { SignupStep, useSignupStep } from "../../hooks/use-signup-step";

const credentialsStepSchema = z.object({
  firstName: z.string().min(1, "Imię jest wymagane."),
  lastName: z.string().min(1, "Nazwisko jest wymagane."),
  email: z
    .string()
    .min(1, "Email jest wymagany.")
    .email("Nieprawidłowy email."),
  password: z
    .string()
    .min(1, "Hasło jest wymagane.")
    .refine(
      (value) =>
        /^(?=(.*[A-Z]))(?=(.*[a-z]))(?=(.*[0-9]))(?=(.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])).{8,}$/.test(
          value,
        ),
      "Hasło musi zawierać min. 8 znaków i co najmniej 3 znaki spośród wymienionych: duża litera, mała litera, cyfra, znak specjalny.",
    ),
});

type CredentialsStepFormData = z.infer<typeof credentialsStepSchema>;

export const CredentialsStep: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CredentialsStepFormData>({
    resolver: zodResolver(credentialsStepSchema),
  });

  const { setStep } = useSignupStep();

  const { isLoaded, signUp } = useSignUp();

  const handleStartEmailCodeFlow = async (data: CredentialsStepFormData) => {
    if (signUp) {
      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
      });

      await signUp!.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    }
  };

  const { mutate: startEmailCodeFlow, isPending } = useMutation({
    mutationFn: handleStartEmailCodeFlow,
    onSuccess: () => setStep(SignupStep.EmailCode),
    onError: (err) => {
      const error = parseAuthError(err);

      if (error.code === "form_identifier_exists") {
        setError("email", {
          type: "manual",
          message: "Konto z podanym adresem email już istnieje.",
        });
      } else if (error.code === "form_password_pwned") {
        setError("password", {
          type: "manual",
          message:
            "Twoje hasło zostało znalezione na liście haseł wykradzionych. Dla bezpieczeństwa konta, proszę użyj innego hasła.",
        });
      }
    },
  });

  return (
    <>
      <Stack
        gap="4px"
        sx={{
          marginBottom: "24px",
        }}
      >
        <Typography variant="h5">Utwórz konto</Typography>
        <Typography variant="body2">
          Zarejestruj się aby rezerwować bilety na filmy w naszym kinie.
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit((data) => startEmailCodeFlow(data))}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Imię"
            fullWidth
            margin="normal"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName ? errors.firstName.message : ""}
          />
          <TextField
            label="Nazwisko"
            fullWidth
            margin="normal"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName ? errors.lastName.message : ""}
          />
        </Stack>
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
          helperText={
            errors.password?.message ??
            "Hasło musi zawierać min. 8 znaków i co najmniej 3 znaki spośród wymienionych: duża litera, mała litera, cyfra, znak specjalny. "
          }
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isPending}
          sx={{
            mt: 2,
          }}
        >
          Utwórz konto
        </Button>
      </form>
      <Typography
        variant="body2"
        sx={{
          marginTop: "16px",
        }}
      >
        Masz już konto? <Link href={pages.auth.login.route}>Zaloguj się</Link>
      </Typography>
    </>
  );
};
