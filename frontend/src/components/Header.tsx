import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div">
          TaskSmith
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
