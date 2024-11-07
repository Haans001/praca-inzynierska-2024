"use client";
import { useUser } from "@clerk/nextjs";
import { Box, Typography } from "@mui/material";

export default function Home() {
  const { user } = useUser();

  console.log(user);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
      }}
    >
      <Typography variant="h3">Projekt Inzynierski 2024!</Typography>
    </Box>
  );
}
