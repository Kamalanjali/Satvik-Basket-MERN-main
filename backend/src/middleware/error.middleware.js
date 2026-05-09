import logger from "../utils/logger.js";
import Sentry from "../config/sentry.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errorCode = err.errorCode || "SERVER_ERROR";

  // Mongo duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
    errorCode = "DUPLICATE_FIELD";
  }

  // JWT invalid
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errorCode = "INVALID_TOKEN";
  }

  // JWT expired
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    errorCode = "TOKEN_EXPIRED";
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
    errorCode = "INVALID_ID";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");

    errorCode = "VALIDATION_ERROR";
  }

  // Zod validation error
  if (err.name === "ZodError") {
    statusCode = 400;

    message = err.errors
      .map((e) => e.message)
      .join(", ");

    errorCode = "VALIDATION_ERROR";
  }

  // Hide internal server details in production
  if (
    process.env.NODE_ENV === "production" &&
    statusCode === 500
  ) {
    message = "Something went wrong";
  }

  // Structured error logging
  if (statusCode >= 500) {
  Sentry.captureException(err);
}

  logger.error({
    message: err.message,
    statusCode,
    errorCode,
    route: req.originalUrl,
    method: req.method,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    path: req.originalUrl,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};

export default errorHandler;