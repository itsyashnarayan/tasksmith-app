import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
  } from '@mui/material';
  import { Edit, Delete } from '@mui/icons-material';
  import { useEffect, useState } from 'react';
  import API from '../services/axios';
  
  const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      assignee: '',
    });
    const [editingId, setEditingId] = useState<number | null>(null);
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      const [taskRes, userRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/users'),
      ]);
      setTasks(taskRes.data);
      setMembers(userRes.data.filter((u: any) => u.role === 'MEMBER'));
    };
  
    const handleSave = async () => {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, form);
      } else {
        await API.post('/tasks', form);
      }
      setOpen(false);
      fetchData();
    };
  
    const handleDelete = async (id: number) => {
      await API.delete(`/tasks/${id}`);
      fetchData();
    };
  
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight="bold">Tasks</Typography>
          <Button variant="contained" onClick={() => {
            setForm({ title: '', description: '', status: 'To Do', priority: 'Medium', assignee: '' });
            setEditingId(null);
            setOpen(true);
          }}>
            + Add Task
          </Button>
        </Box>
  
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Assignee</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task: any) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setEditingId(task.id);
                    setForm(task);
                    setOpen(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>{editingId ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth />
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth />
            <TextField label="Status" select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} fullWidth>
              {['To Do', 'In Progress', 'Done'].map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <TextField label="Priority" select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} fullWidth>
              {['High', 'Medium', 'Low'].map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>
            <TextField label="Assign Developer" select value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} fullWidth>
              {members.map((m: any) => (
                <MenuItem key={m.id} value={m.display_name}>{m.display_name}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default TasksPage;
  