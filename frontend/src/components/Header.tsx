import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Hardcoded test user
  const user = {
    name: 'Yash',
    role: 'ADMIN',
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    setAnchorEl(null);
    // Add actual logout logic here if needed
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#ff1744 !important', // bright red override
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ✅ DEBUG HEADER (CRIMSON)
        </Typography>

        <IconButton onClick={handleProfileClick} color="inherit">
          <Avatar>{user.name[0]}</Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>{user.name}</MenuItem>
          <MenuItem disabled>Role: {user.role}</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
