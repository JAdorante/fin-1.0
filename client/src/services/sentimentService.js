import { api } from './api';

export const getSentiment = async (ticker) => {
  try {
    const response = await api.get(`/sentiment/${ticker}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sentiment for ${ticker}:`, error);
    throw error;
  }
};