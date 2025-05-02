const { auth } = require('firebase-admin');

// Verify the token without requiring additional action
// This is handled by the auth middleware
const verifyToken = (req, res) => {
  return res.status(200).json({
    uid: req.user.uid,
    email: req.user.email,
    authenticated: true
  });
};

// Get the current user profile
const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    
    // Get the user from Firebase Auth
    const userRecord = await auth().getUser(uid);
    
    return res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || '',
      photoURL: userRecord.photoURL || '',
      createdAt: userRecord.metadata.creationTime
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({ message: 'Failed to retrieve user profile' });
  }
};

module.exports = {
  verifyToken,
  getUserProfile
};