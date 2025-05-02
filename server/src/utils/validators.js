const validateTickerFormat = (ticker) => {
    // Basic validation for ticker symbol (alphanumeric, 1-5 chars)
    const tickerRegex = /^[A-Za-z0-9]{1,5}$/;
    return tickerRegex.test(ticker);
  };
  
  const validatePortfolioData = (holdings) => {
    if (!Array.isArray(holdings) || holdings.length === 0) {
      return { valid: false, message: 'Portfolio must contain at least one holding' };
    }
  
    for (const holding of holdings) {
      if (!holding.ticker || typeof holding.ticker !== 'string') {
        return { valid: false, message: 'Each holding must have a valid ticker' };
      }
  
      if (isNaN(holding.shares) || holding.shares <= 0) {
        return { valid: false, message: 'Each holding must have a positive number of shares' };
      }
  
      if (isNaN(holding.averageCost) || holding.averageCost <= 0) {
        return { valid: false, message: 'Each holding must have a positive average cost' };
      }
    }
  
    return { valid: true };
  };
  
  const validateChatInput = (message) => {
    if (!message || typeof message !== 'string') {
      return { valid: false, message: 'Chat message must be a non-empty string' };
    }
  
    if (message.trim().length === 0) {
      return { valid: false, message: 'Chat message cannot be empty' };
    }
  
    // Maximum message length (e.g., 500 characters)
    if (message.length > 500) {
      return { valid: false, message: 'Chat message exceeds maximum length of 500 characters' };
    }
  
    return { valid: true };
  };
  
  module.exports = {
    validateTickerFormat,
    validatePortfolioData,
    validateChatInput
  };