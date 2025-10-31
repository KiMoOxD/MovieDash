import axiosClient from './axiosClient';

/**
 * Series API wrapper
 * Endpoints available on the backend:
 * GET    /api/Series/getAllSeries
 * POST   /api/Series/addNewSeries
 * PUT    /api/Series/updateSeries/{id}
 * DELETE /api/Series/deleteSeries/{id}
 */

const seriesApi = {
  getAllSeries: (config) => {
    const url = '/Series/getAllSeries';
    return axiosClient.get(url, config);
  },

  addSeries: (data, config) => {
    const url = '/Series/addNewSeries';
    return axiosClient.post(url, data, config);
  },

  updateSeries: (id, data, config) => {
    const url = `/Series/updateSeries/${id}`;
    return axiosClient.put(url, data, config);
  },

  deleteSeries: (id, config) => {
    const url = `/Series/deleteSeries/${id}`;
    return axiosClient.delete(url, config);
  },
};

export default seriesApi;
