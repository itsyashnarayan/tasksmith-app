import {
    Box,
    Typography,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
  } from '@mui/material';
  import { Add, Edit, Delete } from '@mui/icons-material';
  import { useState } from 'react';
  
  interface Task {
    id: number;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    assigneeId: number;
    projectId: number;
  }
  
  const mockAssignees = [
    { id: 1, name: 'Yash' },
    { id: 2, name: 'Ananya' },
  ];
  
  const mockProjects = [
    { id: 1, name: 'TaskSmith' },
    { id: 2, name: 'TaskSmith-DatabasePlanning' },
  ];
  
  const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([
      {
        id: 1,
        title: 'implement frontend',
        description: 'frontend using react',
        status: 'To Do',
        priority: 'High',
        dueDate: '2025-06-20',
        assigneeId: 1,
        projectId: 2,
      },
    ]);
  
    const [open, setOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
  
    const [form, setForm] = useState<Omit<Task, 'id'>>({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '',
      assigneeId: 1,
      projectId: 1,
    });
  
    const handleOpen = (task?: Task) => {
      if (task) {
        setEditingTask(task);
        setForm({ ...task });
      } else {
        setEditingTask(null);
        setForm({
          title: '',
          description: '',
          status: 'To Do',
          priority: 'Medium',
          dueDate: '',
          assigneeId: 1,
          projectId: 1,
        });
      }
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleSave = () => {
      if (editingTask) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === editingTask.id ? { ...editingTask, ...form } : t
          )
        );
      } else {
        const newTask: Task = {
          id: Date.now(),
          ...form,
        };
        setTasks((prev) => [...prev, newTask]);
      }
      handleClose();
    };
  
    const handleDelete = (id: number) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    };
  
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Tasks
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
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
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Project</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                  <TableCell>{mockAssignees.find(a => a.id === task.assigneeId)?.name}</TableCell>
                  <TableCell>{mockProjects.find(p => p.id === task.projectId)?.name}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpen(task)}>
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
        </TableContainer>
  
        {/* Task Form Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
              select
              fullWidth
            >
              {['To Do', 'In Progress', 'Done'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
              select
              fullWidth
            >
              {['High', 'Medium', 'Low'].map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Assignee"
              select
              value={form.assigneeId}
              onChange={(e) => setForm({ ...form, assigneeId: Number(e.target.value) })}
              fullWidth
            >
              {mockAssignees.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Project"
              select
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: Number(e.target.value) })}
              fullWidth
            >
              {mockProjects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
  
  export default TasksPage;
  