const { yahooFinanceApi } = require('../utils/apiClients');

// Get current security data
const getSecurityData = async (ticker) => {
  try {
    // Use Yahoo Finance API
    const response = await yahooFinanceApi.get(`/v6/finance/quote`, {
      params: {
        symbols: ticker
      }
    });
    
    // Extract relevant data
    const quoteData = response.data.quoteResponse.result[0];
    
    if (!quoteData) {
      return null;
    }
    
    // For MVP, we're using a mocked description
    // In a real implementation, this would use actual company description
    const mockDescriptions = {
      'AAPL': 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and related services.',
      'MSFT': 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company offers cloud services, AI, and productivity solutions.',
      'GOOGL': 'Alphabet Inc. provides various products and platforms in the United States and internationally. The company offers search, advertising, cloud computing, and research services.',
      'AMZN': 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions worldwide. The company operates through e-commerce, cloud computing, and digital advertising.',
      'TSLA': 'Tesla, Inc. designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems worldwide. The company offers cutting-edge automotive technology.',
      // Default description
      'DEFAULT': 'A publicly traded company that offers products and services in its respective industry sector.'
    };
    
    return {
      ticker: quoteData.symbol,
      name: quoteData.longName || quoteData.shortName,
      price: quoteData.regularMarketPrice,
      previousClose: quoteData.regularMarketPreviousClose,
      dailyChange: quoteData.regularMarketChangePercent,
      volume: quoteData.regularMarketVolume,
      marketCap: quoteData.marketCap,
      description: mockDescriptions[ticker] || mockDescriptions.DEFAULT,
      exchange: quoteData.fullExchangeName,
      currency: quoteData.currency
    };
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    
    // For MVP, return mock data if API fails
    return generateMockSecurityData(ticker);
  }
};

// Get historical price data
const getHistoricalData = async (ticker, period = '1m') => {
  try {
    // Use Yahoo Finance API
    const response = await yahooFinanceApi.get(`/v8/finance/chart/${ticker}`, {
      params: {
        range: period,
        interval: period === '1d' ? '5m' : '1d',
        includePrePost: false
      }
    });
    
    const chartData = response.data.chart.result[0];
    
    if (!chartData) {
      return null;
    }
    
    const { timestamp, indicators } = chartData;
    const quotes = indicators.quote[0];
    
    // Format the data
    const historicalData = timestamp.map((time, i) => ({
      date: new Date(time * 1000).toISOString().split('T')[0],
      open: quotes.open[i],
      high: quotes.high[i],
      low: quotes.low[i],
      close: quotes.close[i],
      volume: quotes.volume[i]
    }));
    
    return historicalData;
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    
    // For MVP, return mock data if API fails
    return generateMockHistoricalData(ticker, period);
  }
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