import { $authHost } from './index';

export const getAllOrders = async () => {
  const { data } = await $authHost.get('orders');
  return data;
};
