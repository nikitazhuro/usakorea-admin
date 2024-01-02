import { jwtDecode } from 'jwt-decode';
import { $host, $authHost } from './index';

export const login = async (creads) => {
  const { data } = await $host.post('auth/login', creads);
  localStorage.setItem('accessToken', data);
  return jwtDecode(data);
};

export const authCheck = async () => {
  const { data } = await $authHost.get('auth/check');
  return data;
};
