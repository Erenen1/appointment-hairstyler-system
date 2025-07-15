"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["VALIDATION"] = "VALIDATION_ERROR";
    ErrorType["AUTHENTICATION"] = "AUTHENTICATION_ERROR";
    ErrorType["AUTHORIZATION"] = "AUTHORIZATION_ERROR";
    ErrorType["NOT_FOUND"] = "NOT_FOUND";
    ErrorType["CONFLICT"] = "CONFLICT";
    ErrorType["INTERNAL"] = "INTERNAL_SERVER_ERROR";
    ErrorType["BAD_REQUEST"] = "BAD_REQUEST";
    ErrorType["RATE_LIMIT"] = "RATE_LIMIT_EXCEEDED";
    ErrorType["DATABASE"] = "DATABASE_ERROR";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
class ApiError extends Error {
    constructor(message, type, statusCode, errors, path) {
        super(message);
        this.name = 'ApiError';
        this.success = false;
        this.type = type;
        this.statusCode = statusCode;
        this.errors = errors;
        this.timestamp = new Date().toISOString();
        this.path = path;
    }
    static validation(message = 'Validation hatası', errors) {
        return new ApiError(message, ErrorType.VALIDATION, 400, errors);
    }
    static authentication(message = 'Kimlik doğrulama hatası') {
        return new ApiError(message, ErrorType.AUTHENTICATION, 401);
    }
    static authorization(message = 'Yetkilendirme hatası') {
        return new ApiError(message, ErrorType.AUTHORIZATION, 403);
    }
    static notFound(message = 'Kayıt bulunamadı') {
        return new ApiError(message, ErrorType.NOT_FOUND, 404);
    }
    static conflict(message = 'Çakışma hatası') {
        return new ApiError(message, ErrorType.CONFLICT, 409);
    }
    static badRequest(message = 'Geçersiz istek', errors) {
        return new ApiError(message, ErrorType.BAD_REQUEST, 400, errors);
    }
    static internal(message = 'Sunucu hatası') {
        return new ApiError(message, ErrorType.INTERNAL, 500);
    }
    static database(message = 'Veritabanı hatası') {
        return new ApiError(message, ErrorType.DATABASE, 500);
    }
    static rateLimit(message = 'Çok fazla istek gönderildi') {
        return new ApiError(message, ErrorType.RATE_LIMIT, 429);
    }
    static tooManyRequests(message = 'Çok fazla istek gönderildi') {
        return new ApiError(message, ErrorType.RATE_LIMIT, 429);
    }
    static fromSequelize(sequelizeError) {
        if (sequelizeError.name === 'SequelizeValidationError') {
            const errors = sequelizeError.errors.map((error) => ({
                field: error.path,
                message: error.message,
                code: error.type || error.validatorKey
            }));
            return new ApiError('Validation hatası', ErrorType.VALIDATION, 400, errors);
        }
        if (sequelizeError.name === 'SequelizeUniqueConstraintError') {
            const errors = sequelizeError.errors.map((error) => ({
                field: error.path,
                message: `${error.path} zaten kullanımda`,
                code: 'unique_violation'
            }));
            return new ApiError('Benzersizlik hatası', ErrorType.CONFLICT, 409, errors);
        }
        if (sequelizeError.name === 'SequelizeForeignKeyConstraintError') {
            return new ApiError('Geçersiz referans', ErrorType.BAD_REQUEST, 400);
        }
        return new ApiError('Veritabanı hatası', ErrorType.DATABASE, 500);
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
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map