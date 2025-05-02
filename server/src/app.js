import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  // Chat functionality
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Add welcome message when component mounts
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        content: 'Welcome to Fin 1.0! How can I assist you with your financial questions today?',
        sender: 'fin',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
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
    
    // Mock response after a delay
    setTimeout(() => {
      const response = getMockResponse(inputMessage);
      
      const finMessage = {
        id: Date.now().toString() + '-response',
        content: response,
        sender: 'fin',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, finMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    handleSendMessage();
  };

  // Mock response logic
  const getMockResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('tesla') || lowerMessage.includes('tsla')) {
      return 'TSLA (Tesla Inc.) is currently trading at $267.35, up 2.1% today. Tesla is an electric vehicle and clean energy company founded by Elon Musk.';
    }
    
    if (lowerMessage.includes('portfolio') && lowerMessage.includes('upload')) {
      return 'To upload your portfolio, please prepare a CSV file with the following columns: Ticker, Shares, and AverageCost. Then click the "Upload Portfolio" button.';
    }
    
    if (lowerMessage.includes('market') && (lowerMessage.includes('update') || lowerMessage.includes('summary'))) {
      return 'Market Summary: S&P 500: 4,932.40 (+0.8%), NASDAQ: 16,123.15 (+1.2%), Dow Jones: 38,150.30 (+0.4%). Tech stocks are leading today\'s rally on positive earnings reports.';
    }
    
    if (lowerMessage.includes('strategy')) {
      return 'For a diversified portfolio, consider the MACD Crossover Strategy. This strategy uses the Moving Average Convergence Divergence (MACD) indicator to identify potential entry and exit points. Buy when the MACD line crosses above the signal line, and sell when it crosses below.';
    }
    
    if (lowerMessage.includes('apple') || lowerMessage.includes('aapl')) {
      return 'AAPL (Apple Inc.) is currently trading at $183.50, down 0.3% today. Apple is a technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.';
    }
    
    // Default response
    return 'I understand you\'re asking about ' + message + '. As your financial assistant, I can help with portfolio analysis, market updates, security lookups, and strategy suggestions. Can you provide more specific details about what you\'d like to know?';
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
          <p>Your AI Financial Assistant</p>

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
              <button onClick={() => handleQuickAction('Suggest a strategy for my portfolio')}>
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
                placeholder="Type your financial question..."
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
            <p>This is for informational purposes only. Not financial advice. Past performance does not guarantee future results. Investment involves risk.</p>
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