"use client";
import UserProfileMenu from "@/components/user_profile_page/user-profile-menu";
import ReservationsPage from "@/components/user_profile_page/user-reservations";
import UserProfile from "@/components/user_profile_page/user_profile";
import { useUser } from "@clerk/nextjs";
import { Box, Stack } from "@mui/material";
import * as React from "react";
export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const [currentPage, setCurrentPage] = React.useState<"profile" | "reservations">("profile");
  const showProfile = () => setCurrentPage("profile");
  const showReservations = () => setCurrentPage("reservations");
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        margin: 8,
      }}
    >
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
        }}
      >
        <UserProfileMenu
          showProfile={showProfile}
          showReservations={showReservations}
        />
        {currentPage === "profile" && <UserProfile />}
        {currentPage === "reservations" && <ReservationsPage />}
      </Stack>
    </Box>
  );
}
