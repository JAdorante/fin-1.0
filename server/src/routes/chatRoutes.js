const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');

// Process a chat message
router.post('/', verifyToken, chatLimiter, chatController.processMessage);

// Get chat history
router.get('/history', verifyToken, chatController.getChatHistory);

module.exports = router;