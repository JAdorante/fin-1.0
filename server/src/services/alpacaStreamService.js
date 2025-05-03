const { alpacaClient } = require('../utils/apiClients');
let io; // Socket.io instance

// Initialize and connect to Alpaca streaming
const initializeAlpacaStream = (socketIoInstance) => {
  io = socketIoInstance;
  
  const client = alpacaClient.data_stream_v2;
  
  client.onConnect(() => {
    console.log("Connected to Alpaca WebSocket");
    
    // Subscribe to market data - indices
    const indices = ['SPY', 'DIA', 'QQQ', 'IWM'];
    client.subscribeForQuotes(indices);
    
    // Subscribe to common stocks for demo
    const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'];
    client.subscribeForQuotes(stocks);
    
    // Can also subscribe to bars for chart updates
    // client.subscribeForBars(stocks);
  });
  
  client.onStockQuote((quote) => {
    // Process real-time quote data
    console.log(`Quote for ${quote.S}: $${quote.p}`);
    
    // Format the quote data
    const formattedQuote = {
      symbol: quote.S,
      price: quote.p,
      bidPrice: quote.bp,
      bidSize: quote.bs,
      askPrice: quote.ap,
      askSize: quote.as,
      timestamp: quote.t
    };
    
    // Broadcast to clients subscribed to this ticker
    if (io) {
      io.to(quote.S).emit('tickerUpdate', formattedQuote);
      
      // Also broadcast to a general market data channel
      io.to('marketData').emit('tickerUpdate', formattedQuote);
    }
  });
  
  client.onStockBar((bar) => {
    // Process real-time bar data
    console.log(`Bar for ${bar.S}: Open $${bar.o}, Close $${bar.c}`);
    
    // Format the bar data
    const formattedBar = {
      symbol: bar.S,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
      timestamp: bar.t
    };
    
    // Broadcast to clients
    if (io) {
      io.to(`${bar.S}_chart`).emit('barUpdate', formattedBar);
    }
  });
  
  client.onError((error) => {
    console.error("Alpaca WebSocket error:", error);
  });
  
  client.onDisconnect(() => {
    console.log("Disconnected from Alpaca WebSocket");
    
    // Attempt to reconnect after a delay
    setTimeout(() => {
      console.log("Attempting to reconnect to Alpaca WebSocket...");
      client.connect();
    }, 5000);
  });
  
  // Connect to Alpaca
  client.connect();
  
  return client;
};

// Method to add subscriptions for a specific user/connection
const subscribeToTicker = (socket, ticker) => {
  if (!ticker) return;
  
  // Join the room for this ticker
  socket.join(ticker);
  console.log(`Client ${socket.id} subscribed to ${ticker}`);
  
  // If this ticker isn't already being streamed, add it
  try {
    const client = alpacaClient.data_stream_v2;
    client.subscribeForQuotes([ticker]);
    client.subscribeForBars([ticker]);
    console.log(`Added Alpaca subscription for ${ticker}`);
  } catch (error) {
    console.error(`Error subscribing to ${ticker}:`, error);
  }
};

// Method to subscribe to chart data
const subscribeToChart = (socket, ticker) => {
  if (!ticker) return;
  
  // Join the room for this ticker's chart data
  socket.join(`${ticker}_chart`);
  console.log(`Client ${socket.id} subscribed to ${ticker} chart`);
  
  // If this ticker isn't already being streamed, add it
  try {
    const client = alpacaClient.data_stream_v2;
    client.subscribeForBars([ticker]);
    console.log(`Added Alpaca bar subscription for ${ticker}`);
  } catch (error) {
    console.error(`Error subscribing to ${ticker} bars:`, error);
  }
};

module.exports = {
  initializeAlpacaStream,
  subscribeToTicker,
  subscribeToChart
};