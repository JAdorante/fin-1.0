const axios = require('axios');

// Alpaca API configuration
const alpacaConfig = {
  baseURL: 'https://data.alpaca.markets/v2',
  headers: {
    'APCA-API-KEY-ID': 'PKXU634IKLP01J57MXTF',
    'APCA-API-SECRET-KEY': 'p1bxJbkmxoxLrHgvNEoHVUre0Fey2716dWIAxtM8'
  }
};

// Create Alpaca API client
const alpacaApi = axios.create(alpacaConfig);

// Get market summary
const getMarketSummary = async () => {
  try {
    // Use Alpaca API for major indices - get latest bars for major indices
    const symbols = 'SPY,DIA,QQQ,IWM'; // ETFs that track major indices
    const response = await alpacaApi.get(`/stocks/bars/latest`, {
      params: {
        symbols: symbols
      }
    });
    
    const barData = response.data.bars;
    
    if (!barData || Object.keys(barData).length === 0) {
      throw new Error('No market data available from Alpaca');
    }
    
    // Get previous day's data for calculating change
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];
    
    const previousResponse = await alpacaApi.get(`/stocks/bars/day`, {
      params: {
        symbols: symbols,
        start: yesterdayISO,
        limit: 1
      }
    });
    
    const previousData = previousResponse.data.bars;
    
    // Format indices data
    const indices = Object.keys(barData).map(symbol => {
      const bar = barData[symbol];
      const previousBar = previousData[symbol] ? previousData[symbol][0] : null;
      const previousClose = previousBar ? previousBar.c : bar.o;
      const change = ((bar.c - previousClose) / previousClose) * 100;
      
      return {
        name: getIndexName(symbol),
        symbol: symbol,
        value: bar.c,
        change: change,
        previousClose: previousClose
      };
    });
    
    // Get market news using Alpaca News API
    const newsResponse = await alpacaApi.get(`/news`, {
      params: {
        limit: 5
      }
    });
    
    const headlines = newsResponse.data.map(news => ({
      title: news.headline,
      source: news.source
    })).slice(0, 3);
    
    const sentiment = determineMarketSentiment(indices);
    
    return {
      indices,
      headlines,
      sentiment,
      asOf: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market summary:', error);
    
    // Re-throw error instead of falling back to mock data
    throw new Error(`Failed to get market data: ${error.message}`);
  }
};

// Get market news
const getMarketNews = async () => {
  try {
    // Use Alpaca News API
    const response = await alpacaApi.get(`/news`, {
      params: {
        limit: 10
      }
    });
    
    if (!response.data || response.data.length === 0) {
      throw new Error('No news data available from Alpaca');
    }
    
    const headlines = response.data.map(news => ({
      title: news.headline,
      source: news.source,
      url: news.url,
      summary: news.summary
    })).slice(0, 5);
    
    return {
      headlines,
      asOf: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market news:', error);
    
    // Re-throw error instead of falling back to mock data
    throw new Error(`Failed to get market news: ${error.message}`);
  }
};

// Helper to get index name
const getIndexName = (symbol) => {
  const indexNames = {
    'SPY': 'S&P 500',
    'DIA': 'Dow Jones',
    'QQQ': 'NASDAQ',
    'IWM': 'Russell 2000'
  };
  
  return indexNames[symbol] || symbol;
};

// Determine market sentiment based on indices
const determineMarketSentiment = (indices) => {
  // Algorithm to determine overall market sentiment based on real data
  const sp500 = indices.find(index => index.symbol === 'SPY');
  const nasdaq = indices.find(index => index.symbol === 'QQQ');
  
  if (!sp500 || !nasdaq) return 'Neutral';
  
  const averageChange = (sp500.change + nasdaq.change) / 2;
  
  if (averageChange > 1) return 'Bullish';
  if (averageChange > 0.3) return 'Slightly Bullish';
  if (averageChange < -1) return 'Bearish';
  if (averageChange < -0.3) return 'Slightly Bearish';
  return 'Neutral';
};

module.exports = {
  getMarketSummary,
  getMarketNews
};