import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081',
});

export const getCategories = async () => {
  const response = await API.get('/categories');
  return response.data;
};

export const getFoods = async () => {
  const response = await API.get('/fooditems/getdata');
  return response.data;
};

export const searchFoods = async (keyword) => {
  const response = await API.get('/fooditems/search', {
    params: { keyword },
  });
  return response.data;
};
