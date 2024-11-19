import axios from "axios";
import 'dotenv/config'

const instance = axios.create({
  baseURL: `${process.env.SERVER_URL}`,
  timeout: 500,
});

export const createUser = (username) => {
  const data = {
    username,
  };
  return instance.post(`/auth/registration`, data);
};

export const loginUser = (username) => {
  const data = {
    username,
  };
  return instance.post(`/auth/login`, data);
};

export const getClients = (token, limit = 1000, offset = 1000) => {
  return instance.get(`/clients`, {
    params: {
      limit,
      offset,
    },
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const getClientsStatuses = (token, ids) => {
    const data = {
        userIds: ids
    }
  return instance.post(`/clients`, data ,{
    headers: {
      Authorization: `${token}`,
    },
  });
};
