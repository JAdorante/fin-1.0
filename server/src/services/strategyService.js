const { db } = require('../config/db');
const securityDataService = require('./securityDataService');

// Get strategy for portfolio
const getPortfolioStrategy = async (userId) => {
  try {
    // Get the user's latest portfolio
    const userRef = db.collection('users').doc(userId);
    const portfoliosSnapshot = await userRef.collection('portfolios')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    
    if (portfoliosSnapshot.empty) {
      return getMockPortfolioStrategy();
    }
    
    const portfolio = portfoliosSnapshot.docs[0].data();
    
    // For MVP, we're using a mocked strategy
    // In a real implementation, this would use actual strategy models
    return getMockPortfolioStrategy(portfolio);
  } catch (error) {
    console.error('Error generating portfolio strategy:', error);
    return getMockPortfolioStrategy();
  }
};

// Get strategy for specific security
const getSecurityStrategy = async (ticker) => {
  try {
    // Get the security data
    const securityData = await securityDataService.getSecurityData(ticker);
    
    if (!securityData) {
      return getMockSecurityStrategy(ticker);
    }
    
    // Get historical data
    const historicalData = await securityDataService.getHistoricalData(ticker, '6m');
    
    if (!historicalData || historicalData.length === 0) {
      return getMockSecurityStrategy(ticker);
    }
    
    // For MVP, we're using a mocked strategy
    // In a real implementation, this would use actual strategy models
    return getMockSecurityStrategy(ticker, securityData, historicalData);
  } catch (error) {
    console.error(`Error generating strategy for ${ticker}:`, error);
    return getMockSecurityStrategy(ticker);
  }
};

// Generate mock portfolio strategy
const getMockPortfolioStrategy = (portfolio = null) => {
  // MACD Strategy
  return {
    name: 'MACD Crossover Strategy',
    description: 'This strategy uses the Moving Average Convergence Divergence (MACD) indicator to identify potential entry and exit points. Buy when the MACD line crosses above the signal line, and sell when it crosses below.',
    context: portfolio 
      ? `Based on your current portfolio allocation of ${portfolio.holdings.length} assets`
      : 'For a diversified portfolio',
    indicators: [
      'MACD (12, 26, 9)',
      'RSI (14)',
      'Volume'
    ],
    timeframe: 'Medium-term',
    riskLevel: 'Moderate'
  };
};

// Generate mock security strategy
const getMockSecurityStrategy = (ticker, securityData = null, historicalData = null) => {
  // Choose a random strategy type
  const strategyTypes = ['MACD Crossover', 'Moving Average', 'RSI Reversal', 'Bollinger Bands'];
  const strategyType = strategyTypes[Math.floor(Math.random() * strategyTypes.length)];
  
  let strategy = {
    ticker,
    name: `${strategyType} Strategy`,
    timeframe: 'Medium-term',
    riskLevel: 'Moderate'
  };
  
  // Different strategy descriptions
  switch (strategyType) {
    case 'MACD Crossover':
      strategy.description = 'Buy when the MACD line crosses above the signal line, and sell when it crosses below. This helps identify momentum shifts.';
      strategy.indicators = ['MACD (12, 26, 9)', 'Volume'];
      break;
    case 'Moving Average':
      strategy.description = 'Buy when the price crosses above the 50-day moving average, and sell when it crosses below. This strategy follows trends.';
      strategy.indicators = ['50-day MA', '200-day MA', 'Volume'];
      break;
    case 'RSI Reversal':
      strategy.description = 'Buy when RSI falls below 30 and then rises back above it, indicating an oversold condition. Sell when RSI rises above 70 and then falls below it.';
      strategy.indicators = ['RSI (14)', 'Volume'];
      break;
    case 'Bollinger Bands':
        strategy.description = 'Buy when the price touches the lower Bollinger Band and starts to rise, indicating a potential reversal. Sell when the price touches the upper band and starts to fall.';
        strategy.indicators = ['Bollinger Bands (20, 2)', 'Volume'];
        break;
    }
    
    // Add current context if security data is available
    if (securityData) {
      const direction = securityData.dailyChange >= 0 ? 'up' : 'down';
      const percent = Math.abs(securityData.dailyChange).toFixed(2);
      
      strategy.context = `${ticker} is currently trading at $${securityData.price.toFixed(2)}, ${direction} ${percent}% today.`;
    } else {
      strategy.context = `Strategy for ${ticker}`;
    }
    
    return strategy;
  };
  
  module.exports = {
    getPortfolioStrategy,
    getSecurityStrategy
  };