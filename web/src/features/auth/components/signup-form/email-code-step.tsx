"use client";

import { pages } from "@/config/pages";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { parseAuthError } from "../../errors/auth-error";

const emailCodeSchema = z.object({
  code: z.string().min(1, "Kod jest wymagany."),
});

type EmailCodeStepFormData = z.infer<typeof emailCodeSchema>;

export const EmailCodeStep: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailCodeStepFormData>({
    resolver: zodResolver(emailCodeSchema),
  });

  const router = useRouter();

  const { signUp, setActive } = useSignUp();

  const handleVerifyEmailCode = async (data: EmailCodeStepFormData) => {
    if (signUp) {
      const signUpAttempt = await signUp!.attemptEmailAddressVerification({
        code: data.code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        router.push(pages.dashboard.authRedirect.route);
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    }
  };

  const { mutate: verifyEmailCode, isPending } = useMutation({
    mutationFn: handleVerifyEmailCode,
    onError: (err) => {
      const error = parseAuthError(err);

      if (error.code === "too_many_requests") {
        setError("code", {
          type: "manual",
          message: "Zbyt wiele prób. Spróbuj ponownie później.",
        });
      }

      if (error.type === "code") {
        setError("code", {
          type: "manual",
          message: "Nieprawidłowy kod.",
        });
      }
    },
  });

  return (
    <>
      <Stack gap="4px">
        <Typography variant="h5">Wprowadź kod</Typography>
        <Typography variant="body2">
          Na twój email wysłaliśmy kod werfyikacyjny. Wprowadź go poniżej aby
          dokończyć rejestrację.
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit((data) => verifyEmailCode(data))}>
        <TextField
          label="Kod"
          fullWidth
          margin="normal"
          {...register("code")}
          error={!!errors.code}
          helperText={errors.code ? errors.code.message : ""}
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
          Zweryfikuj kod
        </Button>
      </form>
    </>
  );
};
