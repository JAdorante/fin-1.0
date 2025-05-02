import { api } from './api';

export const getStrategyForPortfolio = async () => {
  try {
    const response = await api.get('/strategy/portfolio');
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio strategy:', error);
    throw error;
  }
};

export const getStrategyForSecurity = async (ticker) => {
  try {
    const response = await api.get(`/strategy/security/${ticker}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching strategy for ${ticker}:`, error);
    throw error;
  }
};