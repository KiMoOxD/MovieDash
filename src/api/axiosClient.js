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

// Response interceptor: refresh token on 401 and retry once
let isRefreshing = false;
let refreshPromise = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // if no response or not 401, reject
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // avoid infinite loop
    if (originalRequest._retry) return Promise.reject(error);
    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          isRefreshing = false;
          return Promise.reject(error);
        }
        // use raw axios to call refresh endpoint to avoid interceptor recursion
        refreshPromise = axios.post(`${BASE_URL}/Auth/Refresh`, { token: localStorage.getItem('token'), refreshToken });
      }

      const res = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;
      const newToken = res?.data?.token ?? res?.data?.accessToken ?? res?.data?.Token;
      const newRefresh = res?.data?.refreshToken ?? res?.data?.refresh ?? res?.data?.RefreshToken;
      if (newToken) localStorage.setItem('token', newToken);
      if (newRefresh) localStorage.setItem('refreshToken', newRefresh);

      // set auth header for original request and retry
      originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
      return axiosClient(originalRequest);
    } catch (err) {
      isRefreshing = false;
      refreshPromise = null;
      // if refresh failed, remove tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return Promise.reject(err);
    }
  }
);

export default axiosClient;
