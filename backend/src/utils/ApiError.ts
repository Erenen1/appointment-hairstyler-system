import { ErrorDetail } from '../types/api';

export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  RATE_LIMIT = 'RATE_LIMIT_EXCEEDED',
  DATABASE = 'DATABASE_ERROR'
}

export class ApiError extends Error {
  public success: boolean;
  public type: ErrorType;
  public statusCode: number;
  public errors?: ErrorDetail[];
  public timestamp: string;
  public path?: string;
  constructor(
    message: string,
    type: ErrorType,
    statusCode: number,
    errors?: ErrorDetail[],
    path?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.success = false;
    this.type = type;
    this.statusCode = statusCode;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
  static validation(
    message: string = 'Validation hatası',
    errors?: ErrorDetail[]
  ): ApiError {
    return new ApiError(message, ErrorType.VALIDATION, 400, errors);
  }
  static authentication(
    message: string = 'Kimlik doğrulama hatası'
  ): ApiError {
    return new ApiError(message, ErrorType.AUTHENTICATION, 401);
  }
  static authorization(
    message: string = 'Yetkilendirme hatası'
  ): ApiError {
    return new ApiError(message, ErrorType.AUTHORIZATION, 403);
  }
  static notFound(
    message: string = 'Kayıt bulunamadı'
  ): ApiError {
    return new ApiError(message, ErrorType.NOT_FOUND, 404);
  }
  static conflict(
    message: string = 'Çakışma hatası'
  ): ApiError {
    return new ApiError(message, ErrorType.CONFLICT, 409);
  }
  static badRequest(
    message: string = 'Geçersiz istek',
    errors?: ErrorDetail[]
  ): ApiError {
    return new ApiError(message, ErrorType.BAD_REQUEST, 400, errors);
  }
  static internal(
    message: string = 'Sunucu hatası'
  ): ApiError {
    return new ApiError(message, ErrorType.INTERNAL, 500);
  }
  static database(
    message: string = 'Veritabanı hatası'
  ): ApiError {
    return new ApiError(message, ErrorType.DATABASE, 500);
  }
  static rateLimit(
    message: string = 'Çok fazla istek gönderildi'
  ): ApiError {
    return new ApiError(message, ErrorType.RATE_LIMIT, 429);
  }
  static tooManyRequests(
    message: string = 'Çok fazla istek gönderildi'
  ): ApiError {
    return new ApiError(message, ErrorType.RATE_LIMIT, 429);
  }
  static fromJoi(joiError: any): ApiError {
    const errors: ErrorDetail[] = joiError.details.map((detail: any) => ({
      field: detail.path.join('.'),
      message: detail.message,
      code: detail.type
    }));
    return new ApiError(
      'Validation hatası',
      ErrorType.VALIDATION,
      400,
      errors
    );
  }
  static fromSequelize(sequelizeError: any): ApiError {
    if (sequelizeError.name === 'SequelizeValidationError') {
      const errors: ErrorDetail[] = sequelizeError.errors.map((error: any) => ({
        field: error.path,
        message: error.message,
        code: error.type || error.validatorKey
      }));
      return new ApiError(
        'Validation hatası',
        ErrorType.VALIDATION,
        400,
        errors
      );
    }
    if (sequelizeError.name === 'SequelizeUniqueConstraintError') {
      const errors: ErrorDetail[] = sequelizeError.errors.map((error: any) => ({
        field: error.path,
        message: `${error.path} zaten kullanımda`,
        code: 'unique_violation'
      }));
      return new ApiError(
        'Benzersizlik hatası',
        ErrorType.CONFLICT,
        409,
        errors
      );
    }
    if (sequelizeError.name === 'SequelizeForeignKeyConstraintError') {
      return new ApiError(
        'Geçersiz referans',
        ErrorType.BAD_REQUEST,
        400
      );
    }
    return new ApiError(
      'Veritabanı hatası',
      ErrorType.DATABASE,
      500
    );
  }
  toJSON() {
    return {
      success: this.success,
      type: this.type,
      message: this.message,
      errors: this.errors,
      timestamp: this.timestamp,
      path: this.path
    };
  }
} 