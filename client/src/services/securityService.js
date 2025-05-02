import { api } from './api';

export const getSecurityData = async (ticker) => {
  try {
    const response = await api.get(`/security/${ticker}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    throw error;
  }
};

export const getHistoricalData = async (ticker, period = '1m') => {
  try {
    const response = await api.get(`/security/${ticker}/history`, { params: { period } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    throw error;
  }
};