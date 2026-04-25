const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ msg: 'Resource not found' });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ msg: 'Duplicate field value entered' });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({ msg: message });
  }

  res.status(err.statusCode || 500).json({
    msg: err.message || 'Server Error'
  });
};

module.exports = errorHandler;
