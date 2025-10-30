import axiosClient from './axiosClient';

const moviesApi = {
  getAllMovies: () => {
    const url = '/Movies/getAllMovies';
    return axiosClient.get(url);
  },

  addMovie: (data) => {
    const url = '/Movies/addNewMovie';
    return axiosClient.post(url, data);
  },

  updateMovie: (id, data) => {
    const url = `/Movies/updateMovie/${id}`;
    return axiosClient.put(url, data);
  },

  deleteMovie: (id) => {
    const url = `/Movies/deleteMovie/${id}`;
    return axiosClient.delete(url);
  },
};

export default moviesApi;
