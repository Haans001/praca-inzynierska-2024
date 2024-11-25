"use client";
import { pages } from "@/config/pages";
import { useClerk, useUser } from "@clerk/nextjs";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";

const MAX_POLLING_ATTEMPTS = 10;

export const AuthRedirect: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const userIsSyncedWithDatabase = user?.publicMetadata["databaseID"] as number;

  const beginPolling = React.useCallback(() => {
    let pollingAttempts = 0;

    const interval = setInterval(async () => {
      if (userIsSyncedWithDatabase) {
        clearInterval(interval);
        router.replace(pages.dashboard.repertoire.route);
      } else {
        await user?.reload?.();
      }

      pollingAttempts++;

      if (pollingAttempts >= MAX_POLLING_ATTEMPTS) {
        clearInterval(interval);

        // TODO: Remove user from Clerk and db.

        await signOut({
          redirectUrl: pages.auth.signup.route + "?error=database_sync_failed",
        });
      }
    }, 500);
    return interval;
  }, [user]);

  React.useEffect(() => {
    let ignore = false;
    let interval: NodeJS.Timeout;

    if (!ignore) {
      interval = beginPolling();
    }

    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [beginPolling]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={100} />
    </Box>
  );
};
