function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.status = statusCode;
  return error;
}

module.exports = { createHttpError };