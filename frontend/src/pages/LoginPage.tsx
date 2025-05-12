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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../services/axios';
import { jwtDecode

 } from 'jwt-decode';
const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', credentials);
      const { access_token } = res.data;
  
      // Decode token to get user details
      const decoded: any = jwtDecode(access_token);
  
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', decoded.role);  // ✅ Now available
      localStorage.setItem('user', JSON.stringify(decoded));
  
      // Redirect based on role
      if (decoded.role === 'ADMIN') navigate('/dashboard');
      else if (decoded.role === 'MANAGER') navigate('/projects');
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
