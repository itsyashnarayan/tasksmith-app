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
  import { useState } from 'react';
  
  interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    manager: string;
    teamMembers: string[];
  }
  
  const mockManagers = ['Alice', 'Bob', 'Charlie'];
  const mockTeamMembers = ['Eve', 'Frank', 'Grace'];
  
  const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([
      {
        id: 1,
        name: 'TaskSmith',
        description: 'Frontend & backend planning',
        status: 'PLANNED',
        startDate: '2025-05-10',
        endDate: '2025-06-10',
        manager: 'Alice',
        teamMembers: ['Eve'],
      },
    ]);
  
    const [open, setOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
  
    const [form, setForm] = useState<Omit<Project, 'id'>>({
      name: '',
      description: '',
      status: 'PLANNED',
      startDate: '',
      endDate: '',
      manager: '',
      teamMembers: [],
    });
  
    const handleOpen = (project?: Project) => {
      if (project) {
        setEditingProject(project);
        setForm({ ...project });
      } else {
        setEditingProject(null);
        setForm({
          name: '',
          description: '',
          status: 'PLANNED',
          startDate: '',
          endDate: '',
          manager: '',
          teamMembers: [],
        });
      }
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleSave = () => {
      if (editingProject) {
        // Edit existing project
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingProject.id ? { ...editingProject, ...form } : p
          )
        );
      } else {
        // Add new project
        const newProject: Project = {
          id: Date.now(),
          ...form,
        };
        setProjects((prev) => [...prev, newProject]);
      }
      handleClose();
    };
  
    const handleDelete = (id: number) => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    };
  
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Projects
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
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
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate}</TableCell>
                  <TableCell>{project.manager}</TableCell>
                  <TableCell>{project.teamMembers.join(', ')}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpen(project)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(project.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Project Form Modal */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              select
              fullWidth
            >
              {['PLANNED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Manager"
              value={form.manager}
              onChange={(e) => setForm({ ...form, manager: e.target.value })}
              select
              fullWidth
            >
              {mockManagers.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Team Members (comma-separated)"
              value={form.teamMembers.join(', ')}
              onChange={(e) =>
                setForm({ ...form, teamMembers: e.target.value.split(',').map(t => t.trim()) })
              }
              fullWidth
            />
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
  
  export default ProjectsPage;
  