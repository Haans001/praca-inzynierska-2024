import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3">Projekt Inzynierski 2024</Typography>
    </Box>
  );
}
