import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import API from '../services/axios';

const ROLES = ['ADMIN', 'MANAGER', 'MEMBER'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ display_name: '', email: '', password: '' });

  const fetchUsers = async () => {
    const res = await API.get('/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const groupedUsers = ROLES.reduce((acc: any, role) => {
    acc[role] = users.filter((user) => user.role === role);
    return acc;
  }, {});

  const handleOpen = (role: string) => {
    setRole(role);
    setOpen(true);
  };

  const handleAddUser = async () => {
    await API.post('/auth/register', { ...form, role });
    setOpen(false);
    setForm({ display_name: '', email: '', password: '' });
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        All Users
      </Typography>
      {ROLES.map((role) => (
        <Card key={role} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight="bold">
                {role}
              </Typography>
              <IconButton onClick={() => handleOpen(role)} color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            {groupedUsers[role]?.map((user: { id: number; display_name: string; email: string; role: string }) => (
              <Box key={user.id} display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Box>
                  <Typography>{user.display_name}</Typography>
                  <Typography variant="caption">{user.email}</Typography>
                </Box>
                <IconButton onClick={() => handleDelete(user.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add {role}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Display Name"
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
