import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';

// Alpaca API configuration
const alpacaConfig = {
  keyId: 'PKXU634IKLP01J57MXTF',
  secretKey: 'p1bxJbkmxoxLrHgvNEoHVUre0Fey2716dWIAxtM8',
  paper: true // Using paper trading account
};

// API endpoints
const BASE_URL = 'https://paper-api.alpaca.markets';
const DATA_URL = 'https://data.alpaca.markets';

// Create axios instances
const alpacaAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'APCA-API-KEY-ID': alpacaConfig.keyId,
    'APCA-API-SECRET-KEY': alpacaConfig.secretKey
  }
});

const alpacaDataAPI = axios.create({
  baseURL: DATA_URL,
  headers: {
    'APCA-API-KEY-ID': alpacaConfig.keyId,
    'APCA-API-SECRET-KEY': alpacaConfig.secretKey
  }
});

function App() {
  // Chat functionality
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [realtimeData, setRealtimeData] = useState({});
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  
  // Connect to the websocket for real-time updates
  useEffect(() => {
    // In a production app, you would connect to a server that relays Alpaca's websocket data
    // For demonstration, we'll simulate real-time updates with polling
    const tickerUpdateInterval = setInterval(async () => {
      try {
        // Get market data for a few popular stocks
        const tickers = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'];
        const response = await alpacaDataAPI.get('/v2/stocks/snapshot', {
          params: { symbols: tickers.join(',') }
        });
        
        if (response.data) {
          setRealtimeData(response.data);
        }
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(tickerUpdateInterval);
  }, []);

  // Add welcome message when component mounts
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        content: 'Welcome to Fin 1.0! How can I assist you with your financial questions today? I can provide real-time stock information, market updates, and portfolio analysis.',
        sender: 'fin',
        timestamp: new Date().toISOString(),
      },
    ]);
    
    // Initial market data load
    fetchMarketData();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fetch current market data
  const fetchMarketData = async () => {
    try {
      // Get market clock to check if market is open
      const clockResponse = await alpacaAPI.get('/v2/clock');
      const isMarketOpen = clockResponse.data.is_open;
      
      // Get major indices data (using ETFs as proxies)
      const indices = ['SPY', 'DIA', 'QQQ', 'IWM']; // S&P 500, Dow Jones, NASDAQ, Russell 2000
      const indicesResponse = await alpacaDataAPI.get('/v2/stocks/snapshot', {
        params: { symbols: indices.join(',') }
      });
      
      // Additional market data could be fetched here
      
      return {
        isMarketOpen,
        indices: indicesResponse.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return null;
    }
  };
  
  // Get data for a specific security
  const fetchSecurityData = async (ticker) => {
    try {
      // Get current snapshot
      const response = await alpacaDataAPI.get(`/v2/stocks/snapshot`, {
        params: { symbols: ticker }
      });
      
      // Get asset info
      const assetResponse = await alpacaAPI.get(`/v2/assets/${ticker}`);
      
      return {
        snapshot: response.data[ticker],
        asset: assetResponse.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    
    setLoading(true);
    
    // Process user query and generate response
    const response = await processUserQuery(inputMessage);
    
    const finMessage = {
      id: Date.now().toString() + '-response',
      content: response,
      sender: 'fin',
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, finMessage]);
    setLoading(false);
  };

  const handleQuickAction = async (action) => {
    setInputMessage(action);
    await handleSendMessage();
  };

  // NLP-like function to process user queries and fetch relevant data
  const processUserQuery = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for stock ticker queries - common patterns
    const tickerRegex = /\b([A-Za-z]{1,5})\b/g;
    const potentialTickers = [];
    let match;
    
    // Extract potential tickers
    while ((match = tickerRegex.exec(lowerMessage)) !== null) {
      // Common stock tickers to check
      const commonTickers = ['aapl', 'msft', 'googl', 'amzn', 'tsla', 'meta', 'nvda', 'nflx', 'amd', 'intc'];
      if (commonTickers.includes(match[1].toLowerCase())) {
        potentialTickers.push(match[1].toUpperCase());
      }
    }
    
    // If we found a known ticker, process it
    if (potentialTickers.length > 0) {
      const ticker = potentialTickers[0]; // Use the first match
      try {
        const securityData = await fetchSecurityData(ticker);
        
        if (securityData && securityData.snapshot) {
          const snapshot = securityData.snapshot;
          const asset = securityData.asset;
          
          // Calculate daily change
          const dailyChange = ((snapshot.minuteBar.c - snapshot.prevDailyBar.c) / snapshot.prevDailyBar.c) * 100;
          
          return `${ticker} (${asset.name}) is currently trading at $${snapshot.minuteBar.c.toFixed(2)}, ${dailyChange >= 0 ? 'up' : 'down'} ${Math.abs(dailyChange).toFixed(2)}% today. The daily range is $${snapshot.dailyBar.l.toFixed(2)} - $${snapshot.dailyBar.h.toFixed(2)} with a volume of ${snapshot.dailyBar.v.toLocaleString()}.`;
        } else {
          return `I couldn't find real-time data for ${ticker}. It may not be available or the market might be closed.`;
        }
      } catch (error) {
        console.error(`Error processing ${ticker} data:`, error);
        return `I encountered an issue getting data for ${ticker}. Please try again later.`;
      }
    }
    
    // Check for market update request
    if (lowerMessage.includes('market') && (lowerMessage.includes('update') || lowerMessage.includes('summary'))) {
      try {
        const marketData = await fetchMarketData();
        
        if (marketData) {
          const spyData = marketData.indices['SPY'];
          const diaData = marketData.indices['DIA'];
          const qqqData = marketData.indices['QQQ'];
          
          // Calculate daily changes
          const spyChange = ((spyData.minuteBar.c - spyData.prevDailyBar.c) / spyData.prevDailyBar.c) * 100;
          const diaChange = ((diaData.minuteBar.c - diaData.prevDailyBar.c) / diaData.prevDailyBar.c) * 100;
          const qqqChange = ((qqqData.minuteBar.c - qqqData.prevDailyBar.c) / qqqData.prevDailyBar.c) * 100;
          
          return `Market Summary: S&P 500 (SPY): $${spyData.minuteBar.c.toFixed(2)} (${spyChange >= 0 ? '+' : ''}${spyChange.toFixed(2)}%), Dow Jones (DIA): $${diaData.minuteBar.c.toFixed(2)} (${diaChange >= 0 ? '+' : ''}${diaChange.toFixed(2)}%), NASDAQ (QQQ): $${qqqData.minuteBar.c.toFixed(2)} (${qqqChange >= 0 ? '+' : ''}${qqqChange.toFixed(2)}%). The market is currently ${marketData.isMarketOpen ? 'open' : 'closed'}.`;
        } else {
          return `I couldn't retrieve the current market data. Please try again later.`;
        }
      } catch (error) {
        console.error('Error getting market data:', error);
        return `I encountered an issue retrieving market data. This could be due to market hours or connectivity issues.`;
      }
    }
    
    // Check for portfolio upload request
    if (lowerMessage.includes('portfolio') && lowerMessage.includes('upload')) {
      return 'To upload your portfolio, please prepare a CSV file with the following columns: Ticker, Shares, and AverageCost. Then click the "Upload Portfolio" button. I can analyze your holdings and provide insights based on current market conditions.';
    }
    
    // Check for strategy request
    if (lowerMessage.includes('strategy')) {
      return 'For a diversified portfolio in the current market conditions, consider the MACD Crossover Strategy. This strategy uses the Moving Average Convergence Divergence (MACD) indicator to identify potential entry and exit points. Buy when the MACD line crosses above the signal line, and sell when it crosses below. This can help you navigate market volatility while maintaining a long-term perspective.';
    }
    
    // Default conversational response
    return `I understand you're asking about "${message}". As your financial assistant with access to real-time market data, I can help with stock prices, portfolio analysis, market updates, and investment strategies. Can you be more specific about what you'd like to know?`;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">Fin 1.0</div>
          <div className="user-info">
            <span>demo@example.com</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard">
          <h1>Welcome to Fin 1.0</h1>
          <p>Your AI Financial Assistant with Real-Time Market Data</p>

          {/* Chat Container */}
          <div className="chat-container">
            {/* Quick Actions */}
            <div className="quick-actions">
              <button onClick={() => handleQuickAction('Upload Portfolio')}>
                Upload Portfolio
              </button>
              <button onClick={() => handleQuickAction('Show market summary')}>
                Market Update
              </button>
              <button onClick={() => handleQuickAction('What is AAPL trading at?')}>
                Check AAPL
              </button>
              <button onClick={() => handleQuickAction('Suggest a strategy for this market')}>
                Suggest Strategy
              </button>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender === 'user' ? 'user-message' : 'fin-message'}`}
                >
                  <div className="message-content">
                    <p>{message.content}</p>
                    {message.sender === 'fin' && (
                      <div className="disclaimer">
                        <p>This is for informational purposes only. Not financial advice.</p>
                      </div>
                    )}
                  </div>
                  <div className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="typing-indicator">
                  <span>Fin is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form 
              className="chat-input-container"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about stocks, market updates, or investment strategies..."
                disabled={loading}
                className="chat-input"
              />
              <button 
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="send-button"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="disclaimer">
            <p>This is for informational purposes only. Not financial advice. Past performance does not guarantee future results. Investment involves risk. Powered by Alpaca API.</p>
          </div>
          <div className="footer-info">
            <p>&copy; {new Date().getFullYear()} Fin 1.0 - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;