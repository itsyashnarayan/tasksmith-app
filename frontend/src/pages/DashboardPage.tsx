import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../services/axios';
import { useAuthStore } from '../store/useAuthStore';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<string[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, projectsRes, tasksRes] = await Promise.all([
          API.get('/users'),
          API.get('/projects'),
          API.get('/tasks'),
        ]);

        setUsers(usersRes.data.map((u: any) => u.display_name).slice(0, 4));
        setProjects(projectsRes.data.map((p: any) => p.name).slice(0, 4));
        setTasks(tasksRes.data.map((t: any) => t.title).slice(0, 4));
      } catch (error) {
        console.error('Error loading dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  const dashboardData = [
    { title: 'Users', items: users, path: '/admin/users' },
    { title: 'Projects', items: projects, path: '/admin/projects' },
    { title: 'Tasks', items: tasks, path: '/admin/tasks' },
  ];

  const handleCardClick = (path: string) => {
    if (currentUser?.role === 'ADMIN') {
      navigate(path);
    } else {
      setOpenDialog(true);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Dashboard
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {dashboardData.map((section, index) => (
          <Card key={index} sx={{ height: '100%' }}>
            <CardActionArea onClick={() => handleCardClick(section.path)}>
              <CardHeader
                title={section.title}
                sx={{
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#f5f5f5',
                }}
              />
              <CardContent>
                <List dense>
                  {section.items.map((item, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Dialog for non-admin users */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Access Denied</DialogTitle>
        <DialogContent>
          <Typography>Only ADMIN can access this page.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
