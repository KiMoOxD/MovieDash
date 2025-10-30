import axios from 'axios';

// Use a relative base URL so the Vite dev server can proxy `/api` to the real backend.
// In production you can set an environment variable (e.g. VITE_API_BASE) to the real
// backend URL and it will be used automatically.
const BASE_URL = import.meta.env.VITE_API_BASE || '/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or wherever you store your token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
