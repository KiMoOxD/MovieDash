// src/api/subscriptions.js
import axiosClient from './axiosClient';

const subscriptionsApi = {
  getAllSubscriptions: (config) => {
    const url = '/Subscription/getAllSubscriptions';
    return axiosClient.get(url, config);
  },

  addSubscription: (data, config) => {
    const url = '/Subscription/addNewSubscription';
    return axiosClient.post(url, data, config);
  },

  updateSubscription: (id, data, config) => {
    const url = `/Subscription/updateSubscription/${id}`;
    return axiosClient.put(url, data, config);
  },

  deleteSubscription: (id, config) => {
    const url = `/Subscription/deleteSubscription/${id}`;
    return axiosClient.delete(url, config);
  },
};

export default subscriptionsApi;
