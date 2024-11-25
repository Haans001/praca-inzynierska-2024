"use client";

import { Box, Button, Stack } from "@mui/material";
import * as React from "react";

type Seat = {
  id: number
  row: number
  number: number
  isOccupied: boolean
  isSelected: boolean
}

export const CinemaRoom: React.FC = () => {

  const [seats, setSeats] = React.useState<Seat[]>(() => {
    const initialSeats: Seat[] = []
    for (let row = 1; row <= 6; row++) {
      for (let number = 1; number <= 8; number++) {
        initialSeats.push({
          id: (row - 1) * 8 + number,
          row,
          number,
          isOccupied: false,
          isSelected: false
        })
      }
    }
    return initialSeats
  })

  const toggleSeatSelection = (id: number) => {
    setSeats(prevSeats =>
      prevSeats.map(seat =>
        seat.id === id && !seat.isOccupied
          ? { ...seat, isSelected: !seat.isSelected }
          : seat
      )
    )
  }
  
  return (
    <Stack sx={{
      display: 'flex',
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#2d6091',
      borderRadius: '5px',
      padding: '15px'
    }}>
      <Stack sx={{
        width: '100%',
        height: '25px',
        backgroundColor: 'white',
        borderRadius: '2px',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
      }}>
        EKRAN
      </Stack>
      <Stack sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '15px',
        marginBottom: '30px'
        }}>
          {seats.map(seat => (
            <Button
              key={seat.id}
              sx={{
                width: '20px',
                height: '60px',
                borderTopLeftRadius: '25px',
                borderTopRightRadius: '25px',
                borderBottomLeftRadius: '0px',
                borderBottomRightRadius: '0px',
                color: 'black',
                backgroundColor: seat.isOccupied
                  ? '#d63a3a'
                  : seat.isSelected
                  ? '#4299e1'
                  : '#48bb78',
                '&:hover': {
                  backgroundColor: seat.isOccupied
                    ? '#d63a3a'
                    : seat.isSelected
                    ? '#2666a3'
                    : '#3182ce'
                },
                '&:disabled': {
                  cursor: 'not-allowed'
                },
                '&:focus': {
                  outline: 'none'
                }
              }}
              onClick={() => toggleSeatSelection(seat.id)}
              disabled={seat.isOccupied}
              aria-label={`Miejsce ${seat.row}-${seat.number} ${
                seat.isOccupied ? 'Zajęte' : seat.isSelected ? 'Wybrane' : 'Dostępne'
              }`}
            >{seat.number}</Button>
          ))}
        </Stack>
        <Stack sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '20px'
        }}>
          {[
            { color: '#48bb78', label: 'Dostępne' },
            { color: '#4299e1', label: 'Wybrane' },
            { color: '#d63a3a', label: 'Zajęte' }
          ].map(({ color, label }) => (
            <Stack key={label} sx={{ display: 'flex', alignItems: 'center' }}>
              <Stack sx={{
                width: '15px',
                height: '15px',
                backgroundColor: color,
                borderRadius: '2px',
                marginRight: '5px'
              }}></Stack>
              <Box component='div' sx={{ display: 'inline' }}>{label}</Box>
            </Stack>
          ))}
        </Stack>
      </Stack>
  );
};

export default CinemaRoom;