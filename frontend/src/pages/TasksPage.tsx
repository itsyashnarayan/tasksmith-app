import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, TextField, Select, MenuItem, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete
} from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import API from '../services/axios';
import { useAuthStore } from '../store/useAuthStore';

interface User {
  id: number;
  display_name: string;
  role: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignees: User[];
  project: {
    id: number;
    name: string;
    manager: User;
  };
}

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<User[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const currentUser = useAuthStore((state) => state.user)!;

  const [projects, setProjects] = useState<{ id: number; name: string; manager?: User; members?: User[] }[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TO_DO',
    dueDate: '',
    projectId: '',
    assigneeIds: [] as number[],
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [projectMembers, setProjectMembers] = useState<User[]>([]);

  useEffect(() => {
    fetchTasks();
    fetchDevelopers();
    fetchProjects();
  }, []);

  useEffect(() => {
    const project = projects.find(p => p.id === Number(form.projectId));
    if (project) {
      API.get(`/projects/${project.id}`).then(res => {
        const projectData = res.data;
        setProjectMembers(projectData.members || []);
      });
    }
  }, [form.projectId]);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      const allTasks: Task[] = res.data;

      if (currentUser?.role === 'ADMIN') {
        setTasks(allTasks);
      } else if (currentUser?.role === 'MANAGER') {
        setTasks(allTasks.filter(task => task.project?.manager?.id === currentUser.id));
      } else {
        setTasks(allTasks.filter(task => task.assignees?.some(user => user.id === currentUser?.id)));
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const res = await API.get('/users?role=MEMBER');
      setDevelopers(res.data);
    } catch (err) {
      console.error('Failed to fetch developers:', err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      const allProjects = res.data;
      let filtered = allProjects;

      if (currentUser?.role === 'MANAGER') {
        filtered = allProjects.filter((p: any) => p.manager?.id === currentUser.id);
      } else if (currentUser?.role === 'MEMBER') {
        filtered = allProjects.filter((p: any) => p.members?.some((m: any) => m.id === currentUser.id));
      }

      setProjects(filtered);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleChange = (id: number, field: string, value: any) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, [field]: value } : task));
  };

  const handleUpdate = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await API.patch(`/tasks/${id}`, {
        status: task.status,
        dueDate: task.dueDate,
        assigneeIds: task.assignees.map(u => u.id),
      });
      setEditId(null);
      fetchTasks();
    }
  };

  const handleCreateTask = async () => {
    const payload = {
      ...form,
      projectId: Number(form.projectId),
      assigneeIds: form.assigneeIds,
    };
    try {
      await API.post('/tasks', payload);
      fetchTasks();
      setForm({ title: '', description: '', status: 'TO_DO', dueDate: '', projectId: '', assigneeIds: [] });
      setOpenDialog(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="bold">Tasks</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>+ Add Task</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
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
                {editId === task.id ? (
                  <>
                    <TableCell>
                      <Select
                        size="small"
                        value={task.status}
                        onChange={(e) => handleChange(task.id, 'status', e.target.value)}
                      >
                        {['TO_DO', 'IN_PROGRESS', 'DONE'].map(status => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      {currentUser?.role !== 'MEMBER' ? (
                        <TextField
                          type="date"
                          size="small"
                          value={task.dueDate}
                          onChange={(e) => handleChange(task.id, 'dueDate', e.target.value)}
                        />
                      ) : task.dueDate}
                    </TableCell>
                    <TableCell>
                      {currentUser?.role !== 'MEMBER' ? (
                        <Select
                          size="small"
                          multiple
                          value={task.assignees.map(a => a.id)}
                          onChange={(e) => {
                            const selectedIds = e.target.value as number[];
                            const selectedUsers = developers.filter((d) => selectedIds.includes(d.id));
                            handleChange(task.id, 'assignees', selectedUsers);
                          }}
                        >
                          {developers.map(dev => (
                            <MenuItem key={dev.id} value={dev.id}>{dev.display_name}</MenuItem>
                          ))}
                        </Select>
                      ) : (
                        task.assignees.filter(a => a.id === currentUser.id).map(a => a.display_name).join(', ') || '—'
                      )}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      {currentUser?.role === 'MEMBER'
                        ? task.assignees.filter(a => a.id === currentUser.id).map(a => a.display_name).join(', ') || '—'
                        : task.assignees.map(a => a.display_name).join(', ')}
                    </TableCell>
                  </>
                )}
                <TableCell>{task.project?.name}</TableCell>
                <TableCell>
                  {editId === task.id ? (
                    <IconButton onClick={() => handleUpdate(task.id)}><Save /></IconButton>
                  ) : (
                    <IconButton onClick={() => setEditId(task.id)}><Edit /></IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <TextField label="Status" select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['TO_DO', 'IN_PROGRESS', 'DONE'].map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
          <TextField label="Due Date" type="date" InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          <Select fullWidth value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} displayEmpty>
            <MenuItem value="">Select Project</MenuItem>
            {projects.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
          <Autocomplete
            multiple
            options={
              currentUser.role === 'ADMIN'
                ? developers
                : currentUser.role === 'MANAGER'
                  ? projectMembers
                  : projectMembers.filter(m => m.id === currentUser.id)
            }
            getOptionLabel={(option) => option.display_name}
            value={developers.filter((d) => form.assigneeIds.includes(d.id))}
            onChange={(e, val) => setForm({ ...form, assigneeIds: val.map((v) => v.id) })}
            renderInput={(params) => <TextField {...params} label="Assignees" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTask}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskPage;
