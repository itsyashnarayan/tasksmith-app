import {
  Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, Checkbox, ListItemText
} from '@mui/material';
import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import API from '../services/axios';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignees: { id: number; display_name: string }[];
  project: { id: number; name: string };
}

const AdminTaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [developers, setDevelopers] = useState<{ id: number; display_name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', status: 'TO_DO', dueDate: '', assigneeIds: [] as number[], projectId: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchDevelopers();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get('/tasks');
    setTasks(res.data);
  };

  const fetchDevelopers = async () => {
    const res = await API.get('/users');
    setDevelopers(res.data.filter((u: any) => u.role === 'DEVELOPER' || u.role === 'MEMBER'));
  };

  const fetchProjects = async () => {
    const res = await API.get('/projects');
    setProjects(res.data.map((p: any) => ({ id: p.id, name: p.name })));
  };

  const handleChange = (id: number, field: string, value: any) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              [field]: field === 'assignees'
                ? developers.filter(d => value.includes(d.id))
                : value
            }
          : t
      )
    );
  };

  const handleUpdate = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await API.patch(`/tasks/${id}`, {
        status: task.status,
        dueDate: task.dueDate,
        assigneeIds: task.assignees.map(a => a.id)
      });
      setEditId(null);
      fetchTasks();
    }
  };

  const handleDelete = async (id: number) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const handleAdd = async () => {
    await API.post('/tasks', {
      title: form.title,
      description: form.description,
      status: form.status,
      dueDate: form.dueDate,
      assigneeIds: form.assigneeIds,
      projectId: parseInt(form.projectId)
    });
    setOpen(false);
    setForm({ title: '', description: '', status: 'TO_DO', dueDate: '', assigneeIds: [], projectId: '' });
    fetchTasks();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Manage Tasks</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Task
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Assignees</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                {editId === task.id ? (
                  <>
                    <TableCell>
                      <Select
                        size="small"
                        value={task.status}
                        onChange={(e) => handleChange(task.id, 'status', e.target.value)}
                      >
                        {['TO_DO', 'IN_PROGRESS', 'DONE'].map(s => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        size="small"
                        value={task.dueDate}
                        onChange={(e) => handleChange(task.id, 'dueDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        multiple
                        size="small"
                        value={task.assignees.map(a => a.id)}
                        onChange={(e) => handleChange(task.id, 'assignees', e.target.value)}
                        renderValue={(selected) => selected.map(id => developers.find(d => d.id === id)?.display_name).join(', ')}
                      >
                        {developers.map(d => (
                          <MenuItem key={d.id} value={d.id}>
                            <Checkbox checked={task.assignees.some(a => a.id === d.id)} />
                            <ListItemText primary={d.display_name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{task.assignees.map(a => a.display_name).join(', ') || 'N/A'}</TableCell>
                  </>
                )}
                <TableCell>{task.project?.name}</TableCell>
                <TableCell>
                  {editId === task.id ? (
                    <IconButton onClick={() => handleUpdate(task.id)}><Save /></IconButton>
                  ) : (
                    <IconButton onClick={() => setEditId(task.id)}><Edit /></IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(task.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField type="date" label="Due Date" InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {['TO_DO', 'IN_PROGRESS', 'DONE'].map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
          <Select
            multiple
            value={form.assigneeIds}
            onChange={(e) => setForm({ ...form, assigneeIds: e.target.value as number[] })}
            renderValue={(selected) => selected.map(id => developers.find(d => d.id === id)?.display_name).join(', ')}
          >
            {developers.map(d => (
              <MenuItem key={d.id} value={d.id}>
                <Checkbox checked={form.assigneeIds.includes(d.id)} />
                <ListItemText primary={d.display_name} />
              </MenuItem>
            ))}
          </Select>
          <Select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} displayEmpty>
            <MenuItem value="">Select Project</MenuItem>
            {projects.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTaskPage;