class AppError extends Error {
  constructor(message, statusCode, errorCode = "GENERAL_ERROR") {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;