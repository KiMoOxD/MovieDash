import axiosClient from './axiosClient';

const moviesApi = {
  getAllMovies: (config) => {
    const url = '/Movies/getAllMovies';
    return axiosClient.get(url, config);
  },

  addMovie: (data, config) => {
    const url = '/Movies/addNewMovie';
    return axiosClient.post(url, data, config);
  },

  updateMovie: (id, data, config) => {
    const url = `/Movies/updateMovie/${id}`;
    return axiosClient.put(url, data, config);
  },

  deleteMovie: (id, config) => {
    const url = `/Movies/deleteMovie/${id}`;
    return axiosClient.delete(url, config);
  },
};

export default moviesApi;
