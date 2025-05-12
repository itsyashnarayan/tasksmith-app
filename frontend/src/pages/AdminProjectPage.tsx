import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
  } from '@mui/material';
  import { Add, Delete, Edit, Save } from '@mui/icons-material';
  import { useEffect, useState } from 'react';
  import API from '../services/axios';
  
  interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    manager: { id: number; display_name: string } | null;
  }
  
  interface Manager {
    id: number;
    display_name: string;
  }
  
  const AdminProjectPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editRowId, setEditRowId] = useState<number | null>(null);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [open, setOpen] = useState(false);
  
    const [form, setForm] = useState({
      name: '',
      description: '',
      status: 'PLANNED',
      startDate: '',
      endDate: '',
      managerId: '',
    });
  
    useEffect(() => {
      fetchData();
      fetchManagers();
    }, []);
  
    const fetchData = async () => {
      const res = await API.get('/projects');
      setProjects(res.data);
    };
  
    const fetchManagers = async () => {
      const res = await API.get('/users');
      setManagers(res.data.filter((u: any) => u.role === 'MANAGER'));
    };
  
    const handleChange = (id: number, field: string, value: any) => {
      setProjects(prev =>
        prev.map(p =>
          p.id === id ? { ...p, [field]: field === 'manager' ? managers.find(m => m.id === +value) : value } : p
        )
      );
    };
  
    const handleUpdate = async (id: number) => {
      const updated = projects.find(p => p.id === id);
      if (updated) {
        await API.patch(`/projects/${id}`, {
          status: updated.status,
          startDate: updated.startDate,
          endDate: updated.endDate,
          managerId: updated.manager?.id,
        });
        setEditRowId(null);
        fetchData();
      }
    };
  
    const handleDelete = async (id: number) => {
      await API.delete(`/projects/${id}`);
      fetchData();
    };
  
    const handleAddProject = async () => {
      await API.post('/projects', {
        ...form,
        managerId: parseInt(form.managerId),
        memberIds: [],
      });
      setOpen(false);
      setForm({
        name: '',
        description: '',
        status: 'PLANNED',
        startDate: '',
        endDate: '',
        managerId: '',
      });
      fetchData();
    };
  
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Manage Projects</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
            Add Project
          </Button>
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map(project => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
  
                  {editRowId === project.id ? (
                    <>
                      <TableCell>
                        <TextField
                          select
                          value={project.status}
                          onChange={e => handleChange(project.id, 'status', e.target.value)}
                          size="small"
                        >
                          {['PLANNED', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          value={project.startDate}
                          onChange={e => handleChange(project.id, 'startDate', e.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="date"
                          value={project.endDate}
                          onChange={e => handleChange(project.id, 'endDate', e.target.value)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={project.manager?.id || ''}
                          onChange={e => handleChange(project.id, 'manager', e.target.value)}
                          size="small"
                        >
                          {managers.map(m => (
                            <MenuItem key={m.id} value={m.id}>
                              {m.display_name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleUpdate(project.id)}>
                          <Save />
                        </IconButton>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{project.status}</TableCell>
                      <TableCell>{project.startDate}</TableCell>
                      <TableCell>{project.endDate}</TableCell>
                      <TableCell>{project.manager?.display_name || 'N/A'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => setEditRowId(project.id)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(project.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={e => setForm({ ...form, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Manager"
              select
              value={form.managerId}
              onChange={e => setForm({ ...form, managerId: e.target.value })}
              fullWidth
            >
              {managers.map(m => (
                <MenuItem key={m.id} value={m.id}>
                  {m.display_name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddProject}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default AdminProjectPage;
  