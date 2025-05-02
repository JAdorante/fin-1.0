const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { verifyToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Upload and analyze portfolio
router.post('/', verifyToken, apiLimiter, portfolioController.uploadPortfolio);

// Get latest portfolio
router.get('/latest', verifyToken, portfolioController.getLatestPortfolio);

module.exports = router;