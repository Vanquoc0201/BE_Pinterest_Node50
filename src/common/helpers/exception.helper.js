import { statusCodes } from "./status-code.helper";

export class BadRequestException extends Error {
  constructor(message = `Bad Request`) {
    super(message);
    this.statusCode = statusCodes.BAD_REQUEST;
    this.name = "BadRequestException";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnAuthorizedException extends Error {
  constructor(message = `Unauthorized`) {
    super(message);
    this.statusCode = statusCodes.UNAUTHORIZED;
    this.name = "UnAuthorizedException";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenException extends Error {
  constructor(message = `Forbidden`) {
    super(message);
    this.statusCode = statusCodes.FORBIDDEN;
    this.name = "ForbiddenException";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundException extends Error {
  constructor(message = `Not Found`) {
    super(message);
    this.statusCode = statusCodes.NOT_FOUND;
    this.name = "NotFoundException";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictException extends Error {
  constructor(message = `Conflict`) {
    super(message);
    this.statusCode = statusCodes.CONFLICT;
    this.name = "ConflictException";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnprocessableEntityException extends Error {
  constructor(message = `Unprocessable Entity / Server Error`) {
    super(message);

    this.statusCode = statusCodes.UNPROCESSABLE_ENTITY || 500;
    this.name = "UnprocessableEntityException";
    Error.captureStackTrace(this, this.constructor);
  }
}
