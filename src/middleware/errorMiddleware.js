function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode =
    error.statusCode ||
    error.status ||
    (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  let message = error.message || "Internal server error";
  if (process.env.NODE_ENV === "production" && error.code === 11000) {
    message = "An account with these details already exists.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
}

module.exports = {
  notFound,
  errorHandler,
};
