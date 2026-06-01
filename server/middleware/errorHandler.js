// Error handling middleware to format responses according to requirements
export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler] Caught error:', err);
  
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An internal server error occurred';

  res.status(statusCode).json({
    success: false,
    message
  });
};
