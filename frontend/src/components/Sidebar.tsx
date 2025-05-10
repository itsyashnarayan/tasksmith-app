import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <Drawer variant="permanent" open={isOpen} PaperProps={{ sx: { width: isOpen ? 200 : 60 } }}>
      <List>
        <ListItemButton component={NavLink} to="/dashboard">
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/projects">
          <ListItemText primary="Projects" />
        </ListItemButton>
        <ListItemButton component={NavLink} to="/tasks">
          <ListItemText primary="Tasks" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
