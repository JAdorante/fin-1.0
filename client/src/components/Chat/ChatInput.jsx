import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-container">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your financial question..."
        disabled={disabled}
        className="chat-input"
      />
      <button type="submit" disabled={!message.trim() || disabled} className="send-button">
        <span className="send-icon">↑</span>
      </button>
    </form>
  );
};

export default ChatInput;