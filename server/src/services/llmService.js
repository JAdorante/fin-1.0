const { invokeSageMaker } = require('../utils/apiClients');

// Generate response using the fine-tuned DistilBERT model
const generateResponse = async (message) => {
  try {
    // Prepare the input for SageMaker endpoint
    const input = {
      inputs: message,
      parameters: {
        temperature: 0.7,
        max_length: 512,
        top_p: 0.9,
        do_sample: true
      }
    };
    
    // Call SageMaker endpoint
    const response = await invokeSageMaker(input);
    
    // Add disclaimer
    let generatedText = response.generated_text || 'I apologize, but I couldn\'t generate a response at this time.';
    
    // Ensure response ends with proper punctuation before adding disclaimer
    if (!generatedText.endsWith('.') && !generatedText.endsWith('!') && !generatedText.endsWith('?')) {
      generatedText += '.';
    }
    
    const disclaimer = ' This is for informational purposes only. Not financial advice.';
    
    return generatedText + disclaimer;
  } catch (error) {
    console.error('Error generating LLM response:', error);
    
    // Return a fallback response
    return 'I apologize, but I encountered an issue processing your request. Please try again. This is for informational purposes only. Not financial advice.';
  }
};

module.exports = {
  generateResponse
};