/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  // OpenAI API errors
  if (err.name === 'OpenAIError') {
    status = 503;
    message = 'AI service temporarily unavailable';
  }

  // Rate limit errors
  if (err.name === 'TooManyRequests') {
    status = 429;
    message = 'Too many requests, please try again later';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  }

  // Send error response
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
