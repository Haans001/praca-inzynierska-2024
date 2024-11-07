"use client";
import { 
    Button,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
 } from "@mui/material";
import * as React from "react";

export const ReservationsPage: React.FC = () => {
  return (
    <Stack>
        <Paper sx={{maxWidth: "100%", margin: 0, borderLeft: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0,}}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '20px', margin: 5, }}>
                Rezerwacje
            </Typography>
            <Divider variant="middle" />
            <Typography sx={{ fontWeight: 'bold', fontSize: '17px', margin: 5, }}>
                Nadchodzące rezerwacje
            </Typography>
            <Typography sx={{ margin: 5, }}>
                Obecnie brak nadchodzących rezerwacji
            </Typography>
            <Divider variant="middle" />
            <Typography sx={{ fontWeight: 'bold', fontSize: '17px', marginLeft: 5, marginTop: 5, }}>
                Historia rezerwacji
            </Typography>
            <TableContainer >
                <Table aria-label="Historia" sx={{ width: '90%', alignContent: 'center', margin: 5, tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow sx={{ borderBottom: '1px solid #ccc' }}>
                            <TableCell>
                                Dzień
                            </TableCell>
                            <TableCell>
                                Godzina
                            </TableCell>
                            <TableCell>
                                Seans
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>            
                        <TableRow sx={{ borderBottom: '1px solid #ccc' }}>
                            <TableCell>
                                20.10.2024
                            </TableCell>
                            <TableCell>
                                16:00
                            </TableCell>
                            <TableCell>
                                Lśnienie
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    </Stack> 
  );
};

export default ReservationsPage;