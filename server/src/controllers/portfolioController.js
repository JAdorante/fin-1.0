const { db } = require('../config/db');
const { validatePortfolioData } = require('../utils/validators');
const portfolioAnalysisService = require('../services/portfolioAnalysisService');
const { FieldValue } = require('firebase-admin/firestore');

// Upload and analyze portfolio
const uploadPortfolio = async (req, res) => {
  try {
    const { holdings } = req.body;
    const { uid } = req.user;
    
    // Validate portfolio data
    const validation = validatePortfolioData(holdings);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }
    
    // Analyze portfolio
    const analysis = await portfolioAnalysisService.analyzePortfolio(holdings);
    
    // Store in Firestore
    const userRef = db.collection('users').doc(uid);
    const portfolioRef = userRef.collection('portfolios').doc();
    
    await portfolioRef.set({
      holdings,
      analysis,
      timestamp: FieldValue.serverTimestamp()
    });
    
    return res.status(201).json({
      id: portfolioRef.id,
      holdings,
      analysis
    });
  } catch (error) {
    console.error('Error uploading portfolio:', error);
    return res.status(500).json({ message: 'Failed to upload and analyze portfolio' });
  }
};

// Get the latest portfolio
const getLatestPortfolio = async (req, res) => {
  try {
    const { uid } = req.user;
    
    const userRef = db.collection('users').doc(uid);
    const portfoliosSnapshot = await userRef.collection('portfolios')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    
    if (portfoliosSnapshot.empty) {
      return res.status(404).json({ message: 'No portfolio found' });
    }
    
    const portfolioDoc = portfoliosSnapshot.docs[0];
    
    return res.status(200).json({
      id: portfolioDoc.id,
      ...portfolioDoc.data()
    });
  } catch (error) {
    console.error('Error getting portfolio:', error);
    return res.status(500).json({ message: 'Failed to retrieve portfolio' });
  }
};

module.exports = {
  uploadPortfolio,
  getLatestPortfolio
};