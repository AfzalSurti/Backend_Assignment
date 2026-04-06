const notFoundHandler = (req, res) => {
  return res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
