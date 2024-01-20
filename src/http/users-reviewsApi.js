import { $authHost } from './index';

export const getAllUsersRevies = async () => {
  const { data } = await $authHost.get('users-reviews');
  return data;
};

export const updateUserReview = async (config) => {
  const { data } = await $authHost.post('users-reviews/update', config);
  return data;
};

export const createUserReview = async (config) => {
  const { data } = await $authHost.post('users-reviews/create', config);
  return data;
};

export const deleteUserReview = async (id) => {
  const { data } = await $authHost.delete(`users-reviews/${id}`);
  return data;
};
