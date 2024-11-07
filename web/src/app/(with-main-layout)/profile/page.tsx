"use client";
import { useUser } from "@clerk/nextjs";
import { Box, Stack } from "@mui/material";
import UserProfile from "@/components/user_profile_page/user_profile";
import UserProfileMenu from "@/components/user_profile_page/user-profile-menu";
import * as React from "react";
import ReservationsPage from "@/components/user_profile_page/user-reservations";
export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }
  console.log(user);

  const [currentPage, setCurrentPage] = React.useState<'profile' | 'reservations'>('profile');
  const showProfile = () => setCurrentPage('profile');
  const showReservations = () => setCurrentPage('reservations');
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        margin: 8,
      }}
    >
      <Stack direction={'row'}>
        <UserProfileMenu showProfile={showProfile} showReservations={showReservations} />
        {currentPage === "profile" && (
          <UserProfile />
        )}
        {currentPage === "reservations" && (
          <ReservationsPage />
        )}        
      </Stack>
    </Box>
  );
}
