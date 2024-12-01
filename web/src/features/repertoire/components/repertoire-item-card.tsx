import { pages } from "@/config/pages";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";
import { Repertoire } from "../types/types";

interface RepertoireItemCardProps {
  repertoires: Repertoire[];
}

export const RepertoireItemCard: React.FC<RepertoireItemCardProps> = ({
  repertoires,
}) => {
  const repertoire = repertoires[0];

  const startTimes = repertoires.map((repertoire) => repertoire.startTime);

  const { movie } = repertoire;

  const [detailsModalOpen, setDetailsModalOpen] = React.useState(false);

  const router = useRouter();

  return (
    <Card sx={{ display: "flex", mb: 2, height: "100%" }}>
      <CardMedia
        component="img"
        sx={{ width: 200, height: 200 }}
        image={movie.imageUrl}
        alt={movie.title}
      />
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
            sx={{ cursor: "pointer", color: "primary.main" }}
            onClick={() => setDetailsModalOpen(true)}
          >
            {movie.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {movie.lengthInMinutes} minut
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {repertoires.map((repertoire) => (
              <Button
                key={repertoire.id}
                variant="contained"
                color="primary"
                onClick={() =>
                  router.push(
                    `${pages.dashboard.reservation.route}?showingId=${repertoire.id}`,
                  )
                }
                disabled={new Date(repertoire.startTime) < new Date()}
              >
                {format(new Date(repertoire.startTime), "HH:mm")}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Box>
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{movie.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "row", mb: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 200, height: 200 }}
              image={movie.imageUrl}
              alt={movie.title}
            />
            <Box
              sx={{
                marginLeft: 2,
              }}
            >
              <Typography variant="body1" gutterBottom>
                {movie.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
                {movie.genres.map((genre, idx) => (
                  <Chip key={idx} label={genre} color="primary" />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsModalOpen(false)} color="secondary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
