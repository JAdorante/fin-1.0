const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Verify token
router.get('/verify', verifyToken, authController.verifyToken);

// Get user profile
router.get('/profile', verifyToken, authController.getUserProfile);

module.exports = router;