import axiosClient from './axiosClient';

const episodesApi = {
  getAllEpisodes: (config) => {
    const url = '/Episodes/getAllEpisodes';
    return axiosClient.get(url, config);
  },

  addEpisode: (data, config) => {
    const url = '/Episodes/addNewEpisode';
    return axiosClient.post(url, data, config);
  },

  updateEpisode: (id, data, config) => {
    const url = `/Episodes/updateEpisode/${id}`;
    return axiosClient.put(url, data, config);
  },

  deleteEpisode: (id, config) => {
    const url = `/Episodes/deleteEpisode/${id}`;
    return axiosClient.delete(url, config);
  },
};

export default episodesApi;
