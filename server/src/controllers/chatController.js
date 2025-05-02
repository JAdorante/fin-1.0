const { db } = require('../config/db');
const { validateChatInput } = require('../utils/validators');
const llmService = require('../services/llmService');
const { FieldValue } = require('firebase-admin/firestore');

// Process a chat message
const processMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { uid } = req.user;
    
    // Validate input
    const validation = validateChatInput(message);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }
    
    // Process the message with LLM
    const response = await llmService.generateResponse(message);
    
    // Store in Firestore
    const userRef = db.collection('users').doc(uid);
    const chatRef = userRef.collection('chats').doc();
    
    await chatRef.set({
      query: message,
      response: response,
      timestamp: FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ message: response });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return res.status(500).json({ message: 'Failed to process message' });
  }
};

// Get chat history
const getChatHistory = async (req, res) => {
  try {
    const { uid } = req.user;
    const { limit = 50 } = req.query;
    
    const userRef = db.collection('users').doc(uid);
    const chatsSnapshot = await userRef.collection('chats')
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();
    
    const chats = [];
    chatsSnapshot.forEach(doc => {
      chats.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json(chats.reverse());
  } catch (error) {
    console.error('Error getting chat history:', error);
    return res.status(500).json({ message: 'Failed to retrieve chat history' });
  }
};

module.exports = {
  processMessage,
  getChatHistory
};