const axios = require('axios');
const AWS = require('aws-sdk');
const Alpaca = require('@alpacahq/alpaca-trade-api');

// Initialize Alpaca client with hardcoded keys for personal use
const alpacaClient = new Alpaca({
  keyId: 'PKXU634IKLP01J57MXTF',
  secretKey: 'p1bxJbkmxoxLrHgvNEoHVUre0Fey2716dWIAxtM8',
  paper: true, // Set to false for live trading when ready
  baseUrl: 'https://paper-api.alpaca.markets'
});

// AWS SageMaker client setup (keeping this from the original implementation)
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AKIAYUEI6HK6NBUGXD7E,
  secretAccessKey: process.env.ENedxmOHSjaHLvpb2UacFNthd6bp0OWr5/tzPvC5
});

const sageMakerRuntime = new AWS.SageMakerRuntime();

// Function to invoke SageMaker endpoint
const invokeSageMaker = async (input) => {
  const params = {
    EndpointName: process.env.SAGEMAKER_ENDPOINT,
    ContentType: 'application/json',
    Body: JSON.stringify(input)
  };

  try {
    const response = await sageMakerRuntime.invokeEndpoint(params).promise();
    return JSON.parse(response.Body.toString());
  } catch (error) {
    console.error('Error invoking SageMaker endpoint:', error);
    throw error;
  }
};

module.exports = {
  alpacaClient,
  invokeSageMaker
};