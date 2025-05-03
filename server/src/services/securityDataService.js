const { alpacaClient } = require('../utils/apiClients');

// Get current security data
const getSecurityData = async (ticker) => {
  try {
    // Get latest bar data
    const bars = await alpacaClient.getBars({
      symbols: [ticker],
      timeframe: '1Day',
      limit: 2
    });
    
    const tickerBars = bars[ticker];
    
    if (!tickerBars || tickerBars.length === 0) {
      return null;
    }
    
    const current = tickerBars[tickerBars.length - 1];
    const previous = tickerBars.length > 1 ? tickerBars[0] : null;
    
    // Calculate daily change if previous data is available
    const dailyChange = previous 
      ? ((current.closePrice - previous.closePrice) / previous.closePrice) * 100
      : 0;
    
    // Get company details
    let assetInfo = {};
    try {
      const asset = await alpacaClient.getAsset(ticker);
      assetInfo = {
        name: asset.name,
        exchange: asset.exchange
      };
    } catch (assetError) {
      console.warn(`Could not get asset info for ${ticker}:`, assetError);
      assetInfo = {
        name: `${ticker} Inc.`,
        exchange: 'Unknown'
      };
    }
    
    // For MVP, still using mocked descriptions
    const mockDescriptions = {
      'AAPL': 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
      'MSFT': 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
      'GOOGL': 'Alphabet Inc. provides various products and platforms in the United States and internationally.',
      'AMZN': 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions worldwide.',
      'TSLA': 'Tesla, Inc. designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems worldwide.',
      'DEFAULT': 'A publicly traded company that offers products and services in its respective industry sector.'
    };
    
    return {
      ticker: ticker,
      name: assetInfo.name,
      price: current.closePrice,
      previousClose: previous ? previous.closePrice : current.closePrice,
      dailyChange,
      volume: current.volume,
      marketCap: null, // Alpaca doesn't provide market cap data directly
      description: mockDescriptions[ticker] || mockDescriptions.DEFAULT,
      exchange: assetInfo.exchange,
      currency: 'USD'
    };
  } catch (error) {
    console.error(`Error fetching data for ${ticker} from Alpaca:`, error);
    
    // Return mock data if API fails
    return generateMockSecurityData(ticker);
  }
};

// Get historical price data
const getHistoricalData = async (ticker, period = '1m') => {
  try {
    // Map period to Alpaca timeframe and limit
    const { timeframe, limit } = mapPeriodToAlpaca(period);
    
    // Get historical bars
    const bars = await alpacaClient.getBars({
      symbols: [ticker],
      timeframe,
      limit
    });
    
    const tickerBars = bars[ticker];
    
    if (!tickerBars || tickerBars.length === 0) {
      return null;
    }
    
    // Format the data
    const historicalData = tickerBars.map(bar => ({
      date: bar.timestamp.split('T')[0],
      open: bar.openPrice,
      high: bar.highPrice,
      low: bar.lowPrice,
      close: bar.closePrice,
      volume: bar.volume
    }));
    
    return historicalData;
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker} from Alpaca:`, error);
    
    // Return mock data if API fails
    return generateMockHistoricalData(ticker, period);
  }
};

// Helper to map period to Alpaca parameters
const mapPeriodToAlpaca = (period) => {
  const mapping = {
    '1d': { timeframe: '5Min', limit: 78 },   // 1 day with 5-minute bars
    '5d': { timeframe: '15Min', limit: 130 }, // 5 days with 15-minute bars
    '1m': { timeframe: '1Day', limit: 30 },   // 1 month with daily bars
    '3m': { timeframe: '1Day', limit: 90 },   // 3 months
    '6m': { timeframe: '1Day', limit: 180 },  // 6 months
    '1y': { timeframe: '1Day', limit: 365 },  // 1 year
    '2y': { timeframe: '1Day', limit: 730 },  // 2 years
    '5y': { timeframe: '1Week', limit: 260 }, // 5 years with weekly bars
    'max': { timeframe: '1Month', limit: 100 } // Long-term with monthly bars
  };
  
  return mapping[period] || { timeframe: '1Day', limit: 30 };
};

// Generate mock security data (fallback)
const generateMockSecurityData = (ticker) => {
  const price = Math.random() * 500 + 50;
  const dailyChange = (Math.random() * 6) - 3; // Random between -3% and +3%
  
  return {
    ticker,
    name: `${ticker} Inc.`,
    price,
    previousClose: price * (1 - dailyChange / 100),
    dailyChange,
    volume: Math.floor(Math.random() * 10000000),
    marketCap: price * 1000000000,
    description: `${ticker} is a publicly traded company that offers products and services in its respective industry sector.`,
    exchange: 'NASDAQ',
    currency: 'USD'
  };
};

// Generate mock historical data (fallback)
const generateMockHistoricalData = (ticker, period) => {
  const days = {
    '1d': 1,
    '5d': 5,
    '1m': 30,
    '3m': 90,
    '6m': 180,
    '1y': 365,
    '2y': 730,
    '5y': 1825,
    'max': 2500
  }[period] || 30;
  
  const data = [];
  let price = Math.random() * 500 + 50;
  const volatility = 0.02;
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Random price movement
    const change = volatility * price * (Math.random() - 0.5);
    price += change;
    
    // Ensure price is positive
    if (price <= 0) price = Math.random() * 10 + 1;
    
    // Daily high and low
    const high = price * (1 + Math.random() * 0.02);
    const low = price * (1 - Math.random() * 0.02);
    const open = low + Math.random() * (high - low);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close: price,
      volume: Math.floor(Math.random() * 10000000)
    });
  }
  
  return data;
};

module.exports = {
  getSecurityData,
  getHistoricalData
};