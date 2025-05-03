const { alpacaClient } = require('../utils/apiClients');

// Get market summary
const getMarketSummary = async () => {
  try {
    // Define the major indices symbols (using ETFs that track indices)
    const symbols = ['SPY', 'DIA', 'QQQ', 'IWM']; // ETFs tracking S&P 500, Dow Jones, NASDAQ, Russell 2000
    
    // Get current market data from Alpaca
    const bars = await alpacaClient.getBars({
      symbols,
      timeframe: '1Day',
      limit: 2
    });
    
    // Format indices data
    const indices = [];
    for (const symbol of symbols) {
      const symbolBars = bars[symbol];
      if (symbolBars && symbolBars.length >= 2) {
        const current = symbolBars[symbolBars.length - 1];
        const previous = symbolBars[symbolBars.length - 2];
        
        const change = ((current.closePrice - previous.closePrice) / previous.closePrice) * 100;
        
        indices.push({
          name: getIndexName(symbol),
          symbol,
          value: current.closePrice,
          change,
          previousClose: previous.closePrice
        });
      }
    }
    
    // Get actual news headlines from Alpaca
    const headlines = await getMarketNews();
    
    // Determine market sentiment based on indices performance
    const sentiment = determineMarketSentiment(indices);
    
    return {
      indices,
      headlines: headlines.headlines,
      sentiment,
      asOf: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market summary from Alpaca:', error);
    
    // Return mock data if API fails
    return generateMockMarketSummary();
  }
};

// Get market news
const getMarketNews = async () => {
  try {
    // Get market news from Alpaca
    const news = await alpacaClient.getNews({
      limit: 5,
      sort: 'desc'
    });
    
    const headlines = news.map(item => ({
      title: item.headline,
      source: item.source,
      url: item.url,
      datetime: item.created_at
    })).slice(0, 3); // Just take top 3 headlines
    
    return {
      headlines,
      asOf: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching market news from Alpaca:', error);
    return {
      headlines: getMockHeadlines(),
      asOf: new Date().toISOString()
    };
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
  // Simple algorithm to determine overall market sentiment
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

// Generate mock market headlines (fallback)
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
      symbol: 'SPY',
      value: 450 + (Math.random() * 20 - 10),
      change: spChange,
      previousClose: 450
    },
    {
      name: 'Dow Jones',
      symbol: 'DIA',
      value: 360 + (Math.random() * 10 - 5),
      change: dowChange,
      previousClose: 360
    },
    {
      name: 'NASDAQ',
      symbol: 'QQQ',
      value: 380 + (Math.random() * 15 - 7.5),
      change: nasdaqChange,
      previousClose: 380
    },
    {
      name: 'Russell 2000',
      symbol: 'IWM',
      value: 200 + (Math.random() * 10 - 5),
      change: russellChange,
      previousClose: 200
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