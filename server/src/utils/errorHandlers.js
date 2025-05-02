// 404 Not Found handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // General error handler
  const errorHandler = (err, req, res, next) => {
    // Log the error
    console.error(err);
  
    // Set status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Create error response
    const errorResponse = {
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
      status: statusCode
    };
  
    // Send error response
    res.status(statusCode).json(errorResponse);
  };
  
  module.exports = {
    notFound,
    errorHandler
  };