import { pages } from "@/config/pages";
import { auth } from "@clerk/nextjs/server";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { AdminMenu } from "../shared/admin-menu";
import { Link } from "../shared/link";
import { UserMenu } from "../shared/user-menu";

interface DashboardLayoutProps extends React.PropsWithChildren<{}> {}

export const MainLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { userId } = auth();

  return (
    <div>
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" gap="24px" alignItems={"center"}>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                Kino MS
              </Typography>
              <Stack direction="row">
                <Link href={pages.dashboard.repertoire.route}>Repertuar</Link>
                <AdminMenu />
              </Stack>
            </Stack>
            {userId ? (
              <UserMenu />
            ) : (
              <Stack direction="row">
                <Link href={pages.auth.login.route}>
                  <PersonIcon /> Zaloguj się
                </Link>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{
                    background: "white",
                  }}
                />
                <Link href={pages.auth.signup.route}>Rejestracja</Link>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg">{children}</Container>
    </div>
  );
};
