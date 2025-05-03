import React, { useState } from 'react';

function SimpleApp() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Welcome to Fin 1.0! How can I help you today?', sender: 'fin' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add user message
      setChatMessages([
        ...chatMessages,
        { id: Date.now(), text: message, sender: 'user' }
      ]);
      
      // Simulate response
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { 
            id: Date.now() + 1, 
            text: `I understand you're asking about ${message}. As a financial assistant, I can help with various financial topics.`, 
            sender: 'fin' 
          }
        ]);
      }, 1000);
      
      setMessage('');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Fin 1.0</h1>
      <div style={{ 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        height: '400px', 
        overflowY: 'auto',
        padding: '10px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {chatMessages.map(msg => (
          <div key={msg.id} style={{
            background: msg.sender === 'user' ? '#E6F3FF' : '#E0E0E0',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px',
            maxWidth: '70%',
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your financial question..."
          style={{ flex: 1, padding: '10px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Send</button>
      </form>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
        <p>This is for informational purposes only. Not financial advice.</p>
      </div>
    </div>
  );
}

export default SimpleApp;