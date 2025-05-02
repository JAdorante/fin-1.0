import React from 'react';
import Disclaimer from '/common/Disclaimer';

const ChatMessage = ({ message }) => {
  const { content, sender, timestamp, isError } = message;
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`message ${sender === 'user' ? 'user-message' : 'fin-message'} ${isError ? 'error-message' : ''}`}>
      <div className="message-content">
        <p>{content}</p>
        {sender === 'fin' && !isError && <Disclaimer />}
      </div>
      <div className="message-timestamp">{formattedTime}</div>
    </div>
  );
};

export default ChatMessage;