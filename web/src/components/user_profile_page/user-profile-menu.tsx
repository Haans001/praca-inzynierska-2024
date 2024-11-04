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
import { UserProfile } from './user_profile';
import ReservationsPage from '../reservations/reservations-page';

interface UserMenuProps {
    onMenuClick: (page: 'profile' | 'reservations') => void;
  }

const UserMenu: React.FC<UserMenuProps> = ({ onMenuClick }) => {
    const [activePage, setActivePage] = React.useState<'profile' | 'reservations'>('profile');
    const handlePageChange = (page: 'profile' | 'reservations') => {
      setActivePage(page);
    };

    return (
    <Paper sx={{ maxWidth: '100%', borderRight: '0', borderTopRightRadius: '0', borderBottomRightRadius: 0 }}>
      <MenuList>
        <MenuItem onClick={() => onMenuClick('profile')}>
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profil</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => onMenuClick('reservations')}>
          <ListItemIcon>
            <ClassIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rezerwacje</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
    );
};

export default UserMenu;