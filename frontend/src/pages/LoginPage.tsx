import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/axios';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../store/useAuthStore'; // ⬅️ Zustand import

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser); // ⬅️ Zustand function

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', credentials);
      const { access_token } = res.data;

      const decoded: any = jwtDecode(access_token);
      console.log(decoded); // Check what fields are present in token

      const user = {
        id: decoded.sub, // or decoded.id if your backend uses 'id'
        email: decoded.email,
        role: decoded.role,
        display_name: decoded.display_name,
      };

      localStorage.setItem('token', access_token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));

      useAuthStore.getState().setUser(user); // update Zustand too

      // Redirect based on role
      if (user.role === 'ADMIN') navigate('/dashboard');
      else if (user.role === 'MANAGER') navigate('/projects');
      else navigate('/tasks');
    } catch (err) {
      alert('Invalid credentials. Try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
          Login
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" onClick={handleLogin}>
            Sign In
          </Button>
          <Typography variant="body2" align="center">
            Don’t have an account?{' '}
            <Link href="/register" underline="hover">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
