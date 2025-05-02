const express = require('express');
const router = express.Router();
const sentimentController = require('../controllers/sentimentController');
const { verifyToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Get security sentiment
router.get('/:ticker', verifyToken, apiLimiter, sentimentController.getSecuritySentiment);

module.exports = router;