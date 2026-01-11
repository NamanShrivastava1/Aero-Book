const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Log everything important
  logger.error(err.message, {
    statusCode,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  // Operational error -> send real message
  if (err.isOperational) {
    return res.status(statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming / unknown error -> hide details
  res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};

module.exports = errorHandler;
