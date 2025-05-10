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
  
  const LoginPage = () => {
    const [credentials, setCredentials] = useState({
      email: '',
      password: '',
    });
  
    const navigate = useNavigate();
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleLogin = async () => {
      try {
        const res = await axios.post('http://localhost:3000/auth/login', credentials);
        alert('Login successful!');
        // Save token/user if needed: localStorage.setItem("token", res.data.token)
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        alert('Invalid credentials');
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
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  };
  
  export default LoginPage;
  