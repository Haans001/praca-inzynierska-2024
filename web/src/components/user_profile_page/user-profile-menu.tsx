import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ClassIcon from '@mui/icons-material/Class';
import { 
    Divider,
    Paper,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
 } from "@mui/material";
import * as React from "react";

type UserProfileMenuProps = {
  showProfile: () => void;
  showReservations: () => void;
};

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ showProfile, showReservations }) => {
  return (
    <Paper sx={{ maxWidth: '100%', borderRight: '0', borderTopRightRadius: '0', borderBottomRightRadius: 0 }}>
      <MenuList>
        <MenuItem onClick={(showProfile)}>
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText> Profil </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={(showReservations)}>
          <ListItemIcon>
            <ClassIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rezerwacje</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
};

export default UserProfileMenu;