const { yahooFinanceApi } = require('../utils/apiClients');

// Get market summary
const getMarketSummary = async () => {
  try {
    // Use Yahoo Finance API for major indices
    const response = await yahooFinanceApi.get(`/v6/finance/quote`, {
      params: {
        symbols: '^GSPC,^DJI,^IXIC,^RUT'
      }
    });
    
    const quoteData = response.data.quoteResponse.result;
    
    if (!quoteData || quoteData.length === 0) {
      return generateMockMarketSummary();
    }
    
    // Format indices data
    const indices = quoteData.map(index => ({
      name: getIndexName(index.symbol),
      symbol: index.symbol,
      value: index.regularMarketPrice,
      change: index.regularMarketChangePercent,
      previousClose: index.regularMarketPreviousClose
    }));
    
    // For MVP, we're using mocked headlines and sentiment
    const headlines = getMockHeadlines();
    const sentiment = determineMarketSentiment(indices);
    
    return {
      indices,
      headlines,
      sentiment,
      asOf: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market summary:', error);
    
    // Return mock data if API fails
    return generateMockMarketSummary();
  }
};

// Get market news
const getMarketNews = async () => {
  // For MVP, we're returning mocked news
  // In a real implementation, this would use a news API
  return {
    headlines: getMockHeadlines(),
    asOf: new Date().toISOString()
  };
};

// Helper to get index name
const getIndexName = (symbol) => {
  const indexNames = {
    '^GSPC': 'S&P 500',
    '^DJI': 'Dow Jones',
    '^IXIC': 'NASDAQ',
    '^RUT': 'Russell 2000'
  };
  
  return indexNames[symbol] || symbol;
};

// Determine market sentiment based on indices
const determineMarketSentiment = (indices) => {
  // Simple algorithm to determine overall market sentiment
  const sp500 = indices.find(index => index.symbol === '^GSPC');
  const nasdaq = indices.find(index => index.symbol === '^IXIC');
  
  if (!sp500 || !nasdaq) return 'Neutral';
  
  const averageChange = (sp500.change + nasdaq.change) / 2;
  
  if (averageChange > 1) return 'Bullish';
  if (averageChange > 0.3) return 'Slightly Bullish';
  if (averageChange < -1) return 'Bearish';
  if (averageChange < -0.3) return 'Slightly Bearish';
  return 'Neutral';
};

// Generate mock market headlines
const getMockHeadlines = () => {
  const headlines = [
    { title: 'Tech stocks rally on AI optimism', source: 'Financial Times' },
    { title: 'Fed signals potential interest rate cuts later this year', source: 'Wall Street Journal' },
    { title: 'Retail sales beat expectations, consumer spending remains strong', source: 'Bloomberg' },
    { title: 'Oil prices fall amid demand concerns', source: 'Reuters' },
    { title: 'Earnings season shows resilience in corporate America', source: 'CNBC' }
  ];
  
  // Return 3 random headlines
  return headlines.sort(() => 0.5 - Math.random()).slice(0, 3);
};

// Generate mock market summary (fallback)
const generateMockMarketSummary = () => {
  // Generate random changes
  const spChange = (Math.random() * 2) - 0.5; // Random between -0.5% and 1.5%
  const dowChange = (Math.random() * 2) - 0.5;
  const nasdaqChange = (Math.random() * 2) - 0.5;
  const russellChange = (Math.random() * 2) - 0.5;
  
  // Generate mock indices
  const indices = [
    {
      name: 'S&P 500',
      symbol: '^GSPC',
      value: 4500 + (Math.random() * 200 - 100),
      change: spChange,
      previousClose: 4500
    },
    {
      name: 'Dow Jones',
      symbol: '^DJI',
      value: 36000 + (Math.random() * 1000 - 500),
      change: dowChange,
      previousClose: 36000
    },
    {
      name: 'NASDAQ',
      symbol: '^IXIC',
      value: 14000 + (Math.random() * 700 - 350),
      change: nasdaqChange,
      previousClose: 14000
    },
    {
      name: 'Russell 2000',
      symbol: '^RUT',
      value: 2000 + (Math.random() * 100 - 50),
      change: russellChange,
      previousClose: 2000
    }
  ];
  
  return {
    indices,
    headlines: getMockHeadlines(),
    sentiment: determineMarketSentiment(indices),
    asOf: new Date().toISOString()
  };
};

module.exports = {
  getMarketSummary,
  getMarketNews
};