import { $authHost } from './index';

export const getAllOrders = async () => {
  const { data } = await $authHost.get('orders');
  return data;
};

export const updateOrder = async (config) => {
  const { data } = await $authHost.post('orders/update', config);
  return data;
};
