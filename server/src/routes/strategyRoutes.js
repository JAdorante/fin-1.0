const express = require('express');
const router = express.Router();
const strategyController = require('../controllers/strategyController');
const { verifyToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Get portfolio strategy
router.get('/portfolio', verifyToken, apiLimiter, strategyController.getPortfolioStrategy);

// Get security strategy
router.get('/security/:ticker', verifyToken, apiLimiter, strategyController.getSecurityStrategy);

module.exports = router;