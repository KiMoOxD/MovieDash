import axiosClient from './axiosClient';

const dashboardApi = {
  getStats: (config) => {
    const url = '/Dashboard/DashboardStats';
    return axiosClient.get(url, config);
  },
};

export default dashboardApi;
