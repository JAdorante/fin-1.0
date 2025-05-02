const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const { verifyToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Get market summary
router.get('/summary', verifyToken, apiLimiter, marketController.getMarketSummary);

// Get market news
router.get('/news', verifyToken, apiLimiter, marketController.getMarketNews);

module.exports = router;