"use client";
import { Alert, Snackbar } from "@mui/material";
import { useSearchParams } from "next/navigation";
import * as React from "react";

export const AuthErrorSnackbar: React.FC = () => {
  const searchParams = useSearchParams();

  const error = searchParams.get("error");

  const [open, setOpen] = React.useState(!!error);

  const getMessage = () => {
    if (error === "database_sync_failed") {
      return "Podczas rejestracji wystąpił błąd. Spróbuj ponownie później.";
    }

    return "Podczas rejestracji wystąpił błąd. Spróbuj ponownie później.";
  };

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={() => setOpen(false)}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {getMessage()}
      </Alert>
    </Snackbar>
  );
};
