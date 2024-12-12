import { makeUseAxios, UseAxios as IUseAxios } from 'axios-hooks';
import axios from 'axios';
import { BUSINESS_UNITY, BASE_URL } from '../../config/constants';
import * as moment from 'moment';

const getToken = async (context) => {
  let token = sessionStorage
    ?.getItem('dynamic365Token')
    ?.replace('undefined', '');

  const expiry = moment(localStorage.getItem('expiry'));
  const now = moment();

  if (!token || !expiry.isValid() || now.isAfter(expiry)) {
    const tokenProvider =
      await context.aadTokenProviderFactory.getTokenProvider();
    token = await tokenProvider.getToken(
      `https://${BUSINESS_UNITY}.crm2.dynamics.com`
    );

    sessionStorage.setItem('dynamic365Token', token);
    sessionStorage.setItem('expiry', moment().add(45, 'minutes').toISOString());
  }
  return token;
};

const useAxios = ({ context }: any): IUseAxios => {
  const axiosApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000000000000000,
  });

  axiosApi.interceptors.request.use(
    async (config) => {
      const token = await getToken(context);

      config.headers.Authorization = `Bearer ${token}`;

      return config;
    },
    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
  );

  axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log({ error });
      if (error.response && error.response.status === 200) {
        // Reload the page
        console.log('401 Unauthorized detected. Reloading the page...');
        window.location.reload();
      }

      return Promise.reject(error);
    }
  );

  return makeUseAxios({
    axios: axiosApi,
  });
};

export default useAxios;
