import axios, { AxiosInstance } from 'axios';
import * as moment from 'moment';
import { BASE_URL, BUSINESS_UNITY } from '~/config/constants';
import { WebPartContext } from '@microsoft/sp-webpart-base';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000000000000000,
});

const getToken = async () => {
  let token = sessionStorage
    ?.getItem('dynamic365Token')
    ?.replace('undefined', '');

  return token;
};

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Reload the page
      console.log('401 Unauthorized detected. Reloading the page...');

      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;
