const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Required environment variables
const requiredEnvVars = [
  'FIREBASE_SERVICE_ACCOUNT',
  'SAGEMAKER_ENDPOINT',
  'YAHOO_FINANCE_API_KEY'
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
  SAGEMAKER_ENDPOINT: process.env.SAGEMAKER_ENDPOINT,
  YAHOO_FINANCE_API_KEY: process.env.YAHOO_FINANCE_API_KEY
};