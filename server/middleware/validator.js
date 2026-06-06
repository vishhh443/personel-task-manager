
export const validateTask = (req, res, next) => {
  const { title } = req.body;


  if (title === undefined || title === null || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Title is required and cannot be empty.'
    });
  }

  next();
};
