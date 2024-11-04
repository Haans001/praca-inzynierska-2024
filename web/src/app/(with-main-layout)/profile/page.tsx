"use client";
import { useUser } from "@clerk/nextjs";
import { Box } from "@mui/material";
import UserProfile from "@/components/user_profile_page/user_profile";

export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }
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
