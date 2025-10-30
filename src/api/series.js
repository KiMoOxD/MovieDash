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
  getAllSeries: () => {
    const url = '/Series/getAllSeries';
    return axiosClient.get(url);
  },

  addSeries: (data) => {
    const url = '/Series/addNewSeries';
    return axiosClient.post(url, data);
  },

  updateSeries: (id, data) => {
    const url = `/Series/updateSeries/${id}`;
    return axiosClient.put(url, data);
  },

  deleteSeries: (id) => {
    const url = `/Series/deleteSeries/${id}`;
    return axiosClient.delete(url);
  },
};

export default seriesApi;
