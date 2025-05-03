const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./src/utils/errorHandlers');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const marketRoutes = require('./src/routes/marketRoutes');
const portfolioRoutes = require('./src/routes/portfolioRoutes');
const securityRoutes = require('./src/routes/securityRoutes');
const sentimentRoutes = require('./src/routes/sentimentRoutes');
const strategyRoutes = require('./src/routes/strategyRoutes');

// Import Alpaca streaming service
const alpacaStreamService = require('./src/services/alpacaStreamService');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/strategy', strategyRoutes);

// Socket.io connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join the general market data room
  socket.join('marketData');
  
  // Handle client subscription to specific tickers
  socket.on('subscribeTicker', (ticker) => {
    alpacaStreamService.subscribeToTicker(socket, ticker);
  });
  
  // Handle client subscription to chart data
  socket.on('subscribeChart', (ticker) => {
    alpacaStreamService.subscribeToChart(socket, ticker);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize Alpaca streaming with Socket.io instance
alpacaStreamService.initializeAlpacaStream(io);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash in production
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});