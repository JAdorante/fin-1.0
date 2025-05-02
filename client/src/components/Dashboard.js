import React from 'react';
import ChatWindow from './Chat/ChatWindow';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to Fin 1.0</h1>
      <p>Your AI Financial Assistant</p>
      <ChatWindow />
    </div>
  );
};

export default Dashboard;