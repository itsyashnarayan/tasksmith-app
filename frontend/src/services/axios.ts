import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000', // Backend runs on port 4000
  withCredentials: true,            // Important for sending cookies or headers across origins
});

// Attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

