"use client";
import { useUser } from "@clerk/nextjs";
import { 
    Avatar,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Stack,
 } from "@mui/material";
import * as React from "react";
import UserMenu from "./user-profile-menu";
import ReservationsPage from "../reservations/reservations-page";

export const UserProfile: React.FC = () => {
  const [activePage, setActivePage] = React.useState<'profile' | 'reservations'>('profile');
  const handlePageChange = (page: 'profile' | 'reservations') => {
    setActivePage(page);
  };

  const { user } = useUser(); 
  const userAvatar = user?.firstName?.charAt(0).toUpperCase();
  const email = user?.emailAddresses[0].emailAddress;

  return (
    <div>
    <Stack direction={'row'}>
        <UserMenu onMenuClick={handlePageChange} />

        {activePage === 'profile' ? (
        <TableContainer component={Paper} sx={{width: "100%", margin: 0, borderLeft: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,}}>
        <Table aria-label="Profil użytkownika" sx={{ width: '90%', alignContent: 'center', margin: 5, tableLayout: 'fixed' }}>
          <TableBody>
            <TableRow sx={{ borderBottom: '1px solid #ccc' }}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '20px', paddingY: '36px' }}>
              Profil użytkownika  
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell sx={{ paddingY: '36px', fontSize: '16px', }}>
                Profil
              </TableCell>
              <TableCell sx={{ paddingY: '36px', }}>
                <Stack direction="row" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 50, height: 50 }}>{userAvatar}</Avatar>
                  {user?.firstName} {user?.lastName}
                </Stack>
                <Button variant="outlined">Edytuj profil</Button>
              </Stack>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ paddingY: '36px', fontSize: '16px', }}>
                E-mail
              </TableCell>
              <TableCell sx={{ paddingY: '36px' }}>
                {email}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ paddingY: '36px', fontSize: '16px', }}>
                Hasło
              </TableCell>
              <TableCell sx={{ paddingY: '36px' }}>
                <Button variant='contained'>
                  Zmień hasło
                </Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ paddingY: '36px', borderBottom: 0, fontSize: '16px', }}>
                Karty rabatowe
              </TableCell>
              <TableCell sx={{ paddingY: '36px', borderBottom: 0 }}>
                
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </TableContainer>
        ) : (
          <ReservationsPage />
        )}
        </Stack>
    </div>  
  );
};

export default UserProfile;