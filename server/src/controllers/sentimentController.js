const sentimentService = require('../services/sentimentService');
const { validateTickerFormat } = require('../utils/validators');

// Get sentiment for a security
const getSecuritySentiment = async (req, res) => {
  try {
    const { ticker } = req.params;
    
    // Validate ticker
    if (!validateTickerFormat(ticker)) {
      return res.status(400).json({ message: 'Invalid ticker format' });
    }
    
    const sentiment = await sentimentService.getSecuritySentiment(ticker);
    
    return res.status(200).json(sentiment);
  } catch (error) {
    console.error(`Error getting sentiment for ${req.params.ticker}:`, error);
    return res.status(500).json({ message: 'Failed to fetch sentiment data' });
  }
};

module.exports = {
  getSecuritySentiment
};