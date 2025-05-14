import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import API from '../services/axios';
import { useAuthStore } from '../store/useAuthStore';
import { Autocomplete } from '@mui/material';
interface User {
  id: number;
  display_name: string;
  email: string;
  role: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: User;
  members: User[];
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [allManagers, setAllManagers] = useState<User[]>([]);
  const currentUser = useAuthStore((state) => state.user);
  const [allMembers, setAllMembers] = useState<User[]>([]);

  const [form, setForm] = useState<Omit<Project, 'id' | 'manager' | 'members'> & {
    managerId?: number;
    memberIds?: number[];
  }>({
    name: '',
    description: '',
    status: 'PLANNED',
    startDate: '',
    endDate: '',
    memberIds: [],
  });

  useEffect(() => {
    fetchProjects();
    if (currentUser?.role === 'ADMIN') {
      API.get('/users?role=MANAGER').then(res => setAllManagers(res.data));
    }
    fetchMembers();
  }, []);
  const fetchMembers = async () => {
    try {
      const res = await API.get('/users?role=MEMBER'); // Adjust API endpoint as needed
      setAllMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };
  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      const allProjects: Project[] = res.data;
  
      let filtered: Project[] = [];
  
      if (currentUser?.role === 'ADMIN') {
        filtered = allProjects;
      } else if (currentUser?.role === 'MANAGER') {
        filtered = allProjects.filter(p => p.manager?.id === currentUser.id);
      } else if (currentUser?.role === 'MEMBER') {
        filtered = allProjects.filter(p =>
          p.members?.some(member => member.id === currentUser.id)
        );
      }
  
      setProjects(filtered);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleOpen = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setForm({
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        managerId: project.manager?.id,
        memberIds: project.members?.map((m) => m.id) || [],
      });
    } else {
      setEditingProject(null);
      setForm({
        name: '',
        description: '',
        status: 'PLANNED',
        startDate: '',
        endDate: '',
        managerId: currentUser?.role === 'ADMIN' ? undefined : currentUser?.id,
        memberIds: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const payload = {
      ...form,
      managerId: currentUser?.role === 'ADMIN' ? form.managerId : currentUser?.id,
      memberIds: form.memberIds || [],
    };
    try {
      if (editingProject) {
        const res = await API.put(`/projects/${editingProject.id}`, payload);
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? res.data : p)));
      } else {
        const res = await API.post('/projects', payload);
        setProjects((prev) => [...prev, res.data]);
      }
      handleClose();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">Projects</Typography>
        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER') && (
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
            Add Project
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>
                  {project.startDate
                    ? new Intl.DateTimeFormat('en-GB').format(new Date(project.startDate))
                    : ''}
                </TableCell>
                <TableCell>
                  {project.endDate
                    ? new Intl.DateTimeFormat('en-GB').format(new Date(project.endDate))
                    : ''}
                </TableCell>
                <TableCell>{project.manager?.display_name || '—'}</TableCell>
                <TableCell>
                  {project.members?.length
                    ? project.members.map((m) => m.display_name).join(', ')
                    : '—'}
                </TableCell>
                <TableCell align="center">
                  {(currentUser?.role === 'ADMIN' ||
                    (currentUser?.role === 'MANAGER' && currentUser.id === project.manager?.id)) && (
                      <>
                        <IconButton onClick={() => handleOpen(project)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(project.id)}><Delete /></IconButton>
                      </>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>



      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth />
          <TextField label="Status" select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} fullWidth>
            {['PLANNED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
          <TextField label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} InputLabelProps={{ shrink: true }} />
          <TextField label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} InputLabelProps={{ shrink: true }} />
          <Autocomplete
            multiple
            options={allMembers}
            getOptionLabel={(option) => option.display_name}
            value={allMembers.filter((m) => form.memberIds?.includes(m.id))}
            onChange={(event, newValue) =>
              setForm({ ...form, memberIds: newValue.map((m) => m.id) })
            }
            renderInput={(params) => <TextField {...params} label="Team Members" placeholder="Select members" />}
            disableCloseOnSelect
          />
          {currentUser?.role === 'ADMIN' && (
            <TextField
              label="Manager"
              select
              value={form.managerId ?? ''}
              onChange={(e) => setForm({ ...form, managerId: Number(e.target.value) })}
              fullWidth
            >
              {allManagers.map((m) => (
                <MenuItem key={m.id} value={m.id}>{m.display_name}</MenuItem>
              ))}
            </TextField>
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectsPage;
