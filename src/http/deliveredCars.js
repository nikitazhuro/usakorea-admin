import { $authHost } from './index';

export const getAllDeliveredCars = async () => {
  const { data } = await $authHost.get('delivered-cars');
  return data;
};

export const createDeliveredCar = async (image) => {
  const { data } = await $authHost.post('delivered-cars/create', image);
  return data;
};

export const updateDeliveredCar = async (params) => {
  const { data } = await $authHost.post('delivered-cars/update', params);
  return data;
};

export const deleteDeliveredCar = async (id) => {
  const { data } = await $authHost.delete(`delivered-cars/${id}`,);
  return data;
};