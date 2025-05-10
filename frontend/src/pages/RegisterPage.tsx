import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    MenuItem,
    Paper,
  } from '@mui/material';
  import { useState } from 'react';
  import axios from 'axios';
  
  const roles = ['MANAGER', 'DEVELOPER', 'ADMIN'];
  
  const RegisterPage = () => {
    const [form, setForm] = useState({
      display_name: '',
      email: '',
      password: '',
      role: 'MANAGER',
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async () => {
      try {
        const res = await axios.post('http://localhost:3000/auth/register', form);
        alert('User registered successfully!');
        console.log(res.data);
      } catch (err) {
        console.error(err);
        alert('Registration failed.');
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Create an Account
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Display Name"
              name="display_name"
              value={form.display_name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              select
              fullWidth
            >
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleSubmit}>
              Register
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  };
  
  export default RegisterPage;
  