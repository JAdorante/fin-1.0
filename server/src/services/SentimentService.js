const securityDataService = require('./securityDataService');

// Get sentiment for a security
const getSecuritySentiment = async (ticker) => {
  try {
    // Get the security data
    const securityData = await securityDataService.getSecurityData(ticker);
    
    if (!securityData) {
      return getMockSentiment(ticker);
    }
    
    // For MVP, we're using a mocked sentiment
    // In a real implementation, this would use actual sentiment analysis models
    return getMockSentiment(ticker, securityData);
  } catch (error) {
    console.error(`Error getting sentiment for ${ticker}:`, error);
    return getMockSentiment(ticker);
  }
};

// Generate mock sentiment
const getMockSentiment = (ticker, securityData = null) => {
  // Set of possible sentiment values
  const sentimentValues = ['Positive', 'Neutral', 'Negative'];
  
  // If we have security data, base sentiment on price movement
  let sentiment;
  
  if (securityData && securityData.dailyChange) {
    if (securityData.dailyChange > 1.5) {
      sentiment = 'Positive';
    } else if (securityData.dailyChange < -1.5) {
      sentiment = 'Negative';
    } else {
      sentiment = 'Neutral';
    }
  } else {
    // Randomly select a sentiment
    sentiment = sentimentValues[Math.floor(Math.random() * sentimentValues.length)];
  }
  
  // Generate mock factors based on sentiment
  let factors = [];
  
  switch (sentiment) {
    case 'Positive':
      factors = [
        'Strong quarterly earnings report',
        'Positive analyst coverage',
        'New product announcement'
      ];
      break;
    case 'Neutral':
      factors = [
        'Mixed earnings results',
        'Balancing positive and negative news',
        'Waiting for upcoming catalyst'
      ];
      break;
    case 'Negative':
      factors = [
        'Missed earnings expectations',
        'Industry headwinds',
        'Negative analyst coverage'
      ];
      break;
  }
  
  return {
    ticker,
    value: sentiment,
    factors,
    asOf: new Date().toISOString()
  };
};

module.exports = {
  getSecuritySentiment
};