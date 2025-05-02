import { api } from './api';

export const getMarketSummary = async () => {
  try {
    const response = await api.get('/market/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching market summary:', error);
    throw error;
  }
};