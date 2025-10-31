import axiosClient from './axiosClient';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE || '/api';

const authApi = {
  login: (data) => {
    const url = '/Auth/Login';
    return axiosClient.post(url, data);
  },

  // Use raw axios for refresh to avoid interceptors on axiosClient
  refresh: (data) => {
    const url = `${BASE_URL}/Auth/Refresh`;
    return axios.post(url, data);
  },

  logout: (data) => {
    const url = '/Auth/Logout';
    return axiosClient.post(url, data);
  }
};

export default authApi;
