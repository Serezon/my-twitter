const httpStatusCodes = require('../constants/httpStatusCodes');

class HttpError extends Error {
  constructor({ message, name, statusCode }) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = name;
    Error.captureStackTrace(this, HttpError);
  }
}

class HttpBadRequestError extends HttpError {
  constructor(message = 'Bad request') {
    super({
      message,
      name: "HttpBadRequestError",
      statusCode: httpStatusCodes.BAD_REQUEST,
    });
  }
}

class HttpNotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super({
      message,
      name: "HttpNotFoundError",
      statusCode: httpStatusCodes.NOT_FOUND,
    });
  }
}

class HttpInternalServerError extends HttpError {
  constructor(message = 'Internal server error') {
    super({
      message,
      name: "HttpInternalServerError",
      statusCode: httpStatusCodes.INTERNAL_SERVER,
    });
  }
}

class HttpForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super({
      message,
      name: "HttpForbiddenError",
      statusCode: httpStatusCodes.FORBIDDEN,
    });
  }
}

module.exports = {
  HttpError,
  HttpBadRequestError,
  HttpNotFoundError,
  HttpInternalServerError,
  HttpForbiddenError,
}