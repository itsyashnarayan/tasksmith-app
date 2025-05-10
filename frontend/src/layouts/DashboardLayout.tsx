import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useTheme,
  } from '@mui/material';
  import {
    Brightness4,
    Brightness7,
    Dashboard,
    ListAlt,
    Folder,
    Menu,
  } from '@mui/icons-material';
  import AccountCircleIcon from '@mui/icons-material/AccountCircle';
  import { useNavigate, useLocation, Outlet } from 'react-router-dom';
  import useStore from '../store/useStore';
  
  const expandedWidth = 200;
  const collapsedWidth = 60;
  
  const navItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Projects', icon: <Folder />, path: '/projects' },
    { text: 'Tasks', icon: <ListAlt />, path: '/tasks' },
  ];
  
  const DashboardLayout = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const toggleTheme = useStore((s) => s.toggleTheme);
    const isSidebarOpen = useStore((s) => s.isSidebarOpen);
    const toggleSidebar = useStore((s) => s.toggleSidebar);
  
    return (
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
  
        {/* Top AppBar */}
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center">
              <IconButton color="inherit" onClick={toggleSidebar} sx={{ mr: 1 }}>
                <Menu />
              </IconButton>
              <Typography variant="h6" noWrap>
                TaskSmith
              </Typography>
            </Box>
            <Box>
              <IconButton color="inherit" onClick={toggleTheme}>
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
  
        {/* Sidebar Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: isSidebarOpen ? expandedWidth : collapsedWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: isSidebarOpen ? expandedWidth : collapsedWidth,
              transition: 'width 0.3s',
              overflowX: 'hidden',
            },
          }}
        >
          <Toolbar />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{ justifyContent: isSidebarOpen ? 'initial' : 'center' }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: isSidebarOpen ? 2 : 'auto' }}>
                    {item.icon}
                  </ListItemIcon>
                  {isSidebarOpen && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
  
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: isSidebarOpen ? `${expandedWidth}px` : `${collapsedWidth}px`,
            transition: 'margin-left 0.3s',
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    );
  };
  
  export default DashboardLayout;
  