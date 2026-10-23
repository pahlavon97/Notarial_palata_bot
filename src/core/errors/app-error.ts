export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, statusCode = 500, isOperational = true, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 400, true, context);
  }
}

export class RateLimitExceededError extends AppError {
  public readonly retryAfterSeconds: number;

  constructor(message = 'Rate limit exceeded. Please slow down.', retryAfterSeconds = 60) {
    super(message, 429, true, { retryAfterSeconds });
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class ExternalServiceError extends AppError {
  public readonly serviceName: string;

  constructor(serviceName: string, message: string, context?: Record<string, unknown>) {
    super(`External service error [${serviceName}]: ${message}`, 502, true, { serviceName, ...context });
    this.serviceName = serviceName;
  }
}

export class SecurityViolationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(`Security policy violation: ${message}`, 403, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Requested resource not found', context?: Record<string, unknown>) {
    super(message, 404, true, context);
  }
}
