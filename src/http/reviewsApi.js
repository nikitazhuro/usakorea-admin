import { $authHost } from './index';

export const getAllRevies = async () => {
  const { data } = await $authHost.get('reviews');
  return data;
};

export const updateReview = async (config) => {
  const { data } = await $authHost.post('reviews/update', config);
  return data;
};

export const createReview = async (config) => {
  const { data } = await $authHost.post('reviews/create', config);
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await $authHost.delete(`reviews/${id}`);
  return data;
};
