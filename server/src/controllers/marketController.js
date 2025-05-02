const marketDataService = require('../services/marketDataService');

// Get market summary
const getMarketSummary = async (req, res) => {
  try {
    const marketSummary = await marketDataService.getMarketSummary();
    
    return res.status(200).json(marketSummary);
  } catch (error) {
    console.error('Error getting market summary:', error);
    return res.status(500).json({ message: 'Failed to fetch market summary' });
  }
};

// Get market news
const getMarketNews = async (req, res) => {
  try {
    const marketNews = await marketDataService.getMarketNews();
    
    return res.status(200).json(marketNews);
  } catch (error) {
    console.error('Error getting market news:', error);
    return res.status(500).json({ message: 'Failed to fetch market news' });
  }
};

module.exports = {
  getMarketSummary,
  getMarketNews
};