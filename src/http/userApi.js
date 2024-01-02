import { jwtDecode } from 'jwt-decode';
import { $host, $authHost } from './index';

export const login = async (login, password) => {
  const { data } = await $host.post('user/login', { login, password });
  localStorage.setItem('accessToken', data.accessToken);
  return jwtDecode(data.accessToken);
};

export const authCheck = async () => {
  const { data } = await $authHost.get('user/auth');
  return data;
};
