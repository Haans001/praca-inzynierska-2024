import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";
import { Repertoire } from "../../repertoire/types/types";

interface RepertoireCardProps {
  repertoires: Repertoire[];
}

export const RepertoireCard: React.FC<RepertoireCardProps> = ({
  repertoires,
}) => {
  const repertoire = repertoires[0];

  const { movie } = repertoire;

  const [open, setOpen] = useState(false);

  return (
    <Card sx={{ display: "flex", mb: 2, height: "100%" }}>
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent
          sx={{
            flex: "1 0 auto",
            gap: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            component="div"
            variant="h5"
            sx={{ cursor: "default", color: "primary.main" }}
          >
            {movie.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {repertoires.map((repertoire) => (
              <Button
                key={repertoire.id}
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
              >
                {format(new Date(repertoire.startTime), "HH:mm")}
              </Button>
            ))}
            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
              }}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>
                Rezerwacje na film {movie.title} {format(new Date(repertoire.startTime), "HH:mm")}
              </DialogTitle>
              <DialogContent>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      E-mail użytkownika
                    </TableCell>
                    <TableCell>
                      Zarezerwowane miejsca
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>abc@abc.abc</TableCell>
                    <TableCell>Rząd: 5, Miejsce: 6</TableCell>
                  </TableRow>
                </TableBody>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Powrót</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};
