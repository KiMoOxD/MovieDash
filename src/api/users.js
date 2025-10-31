// src/api/users.js
import axiosClient from './axiosClient';

const usersApi = {
  getAllUsers: (config) => {
    const url = '/User/getAllUsers';
    return axiosClient.get(url, config);
  },

  addUser: (data, config) => {
    const url = '/User/addNewuser';
    return axiosClient.post(url, data, config);
  },

  updateUser: (id, data, config) => {
    const url = `/User/updateuser/${id}`;
    return axiosClient.put(url, data, config);
  },

  deleteUser: (id, config) => {
    const url = `/User/deleteuser/${id}`;
    return axiosClient.delete(url, config);
  },
  getUserById: (id, config) => {
    const url = `/User/getUserById/${id}`;
    return axiosClient.get(url, config);
  },
};

export default usersApi;
