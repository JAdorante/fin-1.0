import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';
import { useAuth } from '../../context/AuthContext';
import { getMessageHistory, sendMessage } from '../../services/chatService';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const history = await getMessageHistory(user.uid);
      setMessages(history);
    } catch (err) {
      console.error('Error loading chat history:', err);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await sendMessage(user.uid, content);
      
      const finMessage = {
        id: response.id,
        content: response.content,
        sender: 'fin',
        timestamp: response.timestamp,
      };
      
      setMessages((prev) => [...prev, finMessage]);
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
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  return (
    <div className="chat-container">
      <QuickActions onActionClick={handleQuickAction} />
      <div className="messages-container">
        {messages.length === 0 && !loading ? (
          <div className="empty-chat">
            <p>Welcome to Fin 1.0! How can I assist you with your financial questions today?</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {loading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatWindow;