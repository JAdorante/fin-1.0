import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        content: 'Welcome to Fin 1.0! How can I assist you with your financial questions today?',
        sender: 'fin',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to the backend
      setTimeout(() => {
        const response = getMockResponse(content);
        
        const finMessage = {
          id: Date.now().toString() + '-response',
          content: response,
          sender: 'fin',
          timestamp: new Date().toISOString(),
        };
        
        setMessages((prev) => [...prev, finMessage]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error sending message:', err);
      
      const errorMessage = {
        id: Date.now().toString() + '-error',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'fin',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
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
    <div className="chat-container">
      <QuickActions onActionClick={handleQuickAction} />
      <div className="messages-container">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {loading && (
          <div className="typing-indicator">
            <span>Fin is typing</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatWindow;