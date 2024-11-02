"use client";
import { useUser } from "@clerk/nextjs";
import { Box, Typography } from "@mui/material";
import UserProfile from "@/components/user/user_profile";

export default function Home() {
  const { user } = useUser();

  console.log(user);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        margin: 8,
      }}
    >

      <UserProfile />

    </Box>
  );
}
