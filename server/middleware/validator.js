// Validation middleware to ensure API requests conform to data requirements
export const validateTask = (req, res, next) => {
  const { title } = req.body;

  // Title validation: must be a non-empty string after trimming
  if (title === undefined || title === null || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Title is required and cannot be empty.'
    });
  }

  next();
};
