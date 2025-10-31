// src/api/channels.js
import axiosClient from './axiosClient';

const channelsApi = {
  getAllChannels: (config) => {
    const url = '/Channel/getAllChannels';
    return axiosClient.get(url, config);
  },

  addChannel: (data, config) => {
    const url = '/Channel/addNewChannel';
    return axiosClient.post(url, data, config);
  },

  updateChannel: (id, data, config) => {
    const url = `/Channel/updatechannel/${id}`;
    return axiosClient.put(url, data, config);
  },

  deleteChannel: (id, config) => {
    const url = `/Channel/deletechannel/${id}`;
    return axiosClient.delete(url, config);
  },
};

export default channelsApi;
