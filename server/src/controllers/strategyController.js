const strategyService = require('../services/strategyService');
const { validateTickerFormat } = require('../utils/validators');

// Get strategy for portfolio
const getPortfolioStrategy = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const strategy = await strategyService.getPortfolioStrategy(uid);
    
    return res.status(200).json(strategy);
  } catch (error) {
    console.error('Error getting portfolio strategy:', error);
    return res.status(500).json({ message: 'Failed to generate portfolio strategy' });
  }
};

// Get strategy for specific security
const getSecurityStrategy = async (req, res) => {
  try {
    const { ticker } = req.params;
    
    // Validate ticker
    if (!validateTickerFormat(ticker)) {
      return res.status(400).json({ message: 'Invalid ticker format' });
    }
    
    const strategy = await strategyService.getSecurityStrategy(ticker);
    
    return res.status(200).json(strategy);
  } catch (error) {
    console.error(`Error getting strategy for ${req.params.ticker}:`, error);
    return res.status(500).json({ message: 'Failed to generate security strategy' });
  }
};

module.exports = {
  getPortfolioStrategy,
  getSecurityStrategy
};