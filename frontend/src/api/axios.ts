import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // ✅ replace with your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // if using cookies/session auth; else set to false
});

// Optional: Attach token from Zustand/localStorage if needed
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
