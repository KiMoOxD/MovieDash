// src/api/userSubscriptions.js
import axiosClient from './axiosClient';

const userSubscriptionsApi = {
  getAllUserSubs: (config) => {
    const url = '/UserSubscription/getAllUserSub';
    return axiosClient.get(url, config);
  },

  addUserSub: (data, config) => {
    const url = '/UserSubscription/addNewUserSub';
    return axiosClient.post(url, data, config);
  },

  updateUserSub: (id, data, config) => {
    const url = `/UserSubscription/updateUserSub/${id}`;
    return axiosClient.put(url, data, config);
  },

  deleteUserSub: (id, config) => {
    const url = `/UserSubscription/deleteUserSub/${id}`;
    return axiosClient.delete(url, config);
  },
};

export default userSubscriptionsApi;
