import axiosClient from './axiosClient';

const episodesApi = {
  getAllEpisodes: () => {
    const url = '/Episodes/getAllEpisodes';
    return axiosClient.get(url);
  },

  addEpisode: (data) => {
    const url = '/Episodes/addNewEpisode';
    return axiosClient.post(url, data);
  },

  updateEpisode: (id, data) => {
    const url = `/Episodes/updateEpisode/${id}`;
    return axiosClient.put(url, data);
  },

  deleteEpisode: (id) => {
    const url = `/Episodes/deleteEpisode/${id}`;
    return axiosClient.delete(url);
  },
};

export default episodesApi;
