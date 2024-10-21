import { Box } from "@mui/material";

interface AuthLayoutProps extends React.PropsWithChildren<{}> {}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 64px)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
