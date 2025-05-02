const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const { verifyToken } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Get security data
router.get('/:ticker', verifyToken, apiLimiter, securityController.getSecurityData);

// Get historical data
router.get('/:ticker/history', verifyToken, apiLimiter, securityController.getHistoricalData);

module.exports = router;