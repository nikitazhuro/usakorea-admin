/* eslint-disable no-param-reassign */
import axios from 'axios';

const url = 'https://api.autosaya.by/';
const localhost = 'http://localhost:5000/';

const $host = axios.create({
  baseURL: url,
});

const $authHost = axios.create({
  baseURL: url,
});

const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
  return config;
};

$authHost.interceptors.request.use(authInterceptor);

export {
  $host,
  $authHost,
};