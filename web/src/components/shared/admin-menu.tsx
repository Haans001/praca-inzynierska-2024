"use client";
import { pages } from "@/config/pages";
import { useIsAdmin } from "@/hooks/use-is-admin";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { Link } from "../shared/link";

interface AdminMenuProps {}

export const AdminMenu: React.FC<AdminMenuProps> = ({}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { isAdmin } = useIsAdmin();

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "capitalize",
        }}
      >
        Admin
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={handleClose}
          component={Link}
          href={pages.admin.movies.route}
          sx={{ color: "black" }}
        >
          Baza filmów
        </MenuItem>
      </Menu>
    </>
  );
};
