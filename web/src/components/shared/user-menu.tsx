"use client";
import { pages } from "@/config/pages";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useClerk, useUser } from "@clerk/nextjs";
import { Logout } from "@mui/icons-material";
import {
  Avatar,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import * as React from "react";

const MENU_ID = "account-menu";

export const UserMenu: React.FC = () => {
  const { user, isLoaded } = useUser();

  const { isAdmin } = useIsAdmin();

  const { signOut } = useClerk();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    await signOut({
      redirectUrl: pages.dashboard.mainPage.route,
    });
    setAnchorEl(null);
  };

  if (!isLoaded) {
    return null;
  }

  const userAvatar = user?.firstName?.charAt(0).toUpperCase();

  return (
    <div>
      {isAdmin ? (
        <Chip label="ADMIN" variant="filled" color="error" size="small" />
      ) : null}
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? MENU_ID : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }}>{userAvatar}</Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id={MENU_ID}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              width: 200,
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profil
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Wyloguj się
        </MenuItem>
      </Menu>
    </div>
  );
};
