const securityDataService = require('../services/securityDataService');
const { validateTickerFormat } = require('../utils/validators');

// Get security data
const getSecurityData = async (req, res) => {
  try {
    const { ticker } = req.params;
    
    // Validate ticker
    if (!validateTickerFormat(ticker)) {
      return res.status(400).json({ message: 'Invalid ticker format' });
    }
    
    const securityData = await securityDataService.getSecurityData(ticker);
    
    if (!securityData) {
      return res.status(404).json({ message: `No data found for ticker: ${ticker}` });
    }
    
    return res.status(200).json(securityData);
  } catch (error) {
    console.error(`Error getting data for ${req.params.ticker}:`, error);
    return res.status(500).json({ message: 'Failed to fetch security data' });
  }
};

// Get historical price data
const getHistoricalData = async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period = '1m' } = req.query;
    
    // Validate ticker
    if (!validateTickerFormat(ticker)) {
      return res.status(400).json({ message: 'Invalid ticker format' });
    }
    
    // Validate period
    const validPeriods = ['1d', '5d', '1m', '3m', '6m', '1y', '2y', '5y', 'max'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ message: 'Invalid period. Valid options are: 1d, 5d, 1m, 3m, 6m, 1y, 2y, 5y, max' });
    }
    
    const historicalData = await securityDataService.getHistoricalData(ticker, period);
    
    if (!historicalData || historicalData.length === 0) {
      return res.status(404).json({ message: `No historical data found for ticker: ${ticker}` });
    }
    
    return res.status(200).json(historicalData);
  } catch (error) {
    console.error(`Error getting historical data for ${req.params.ticker}:`, error);
    return res.status(500).json({ message: 'Failed to fetch historical data' });
  }
};

module.exports = {
  getSecurityData,
  getHistoricalData
};