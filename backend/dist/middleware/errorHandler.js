"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const utils_1 = require("../utils");
const logger_1 = __importDefault(require("../config/logger"));
const requestLogger_1 = require("./requestLogger");
const errorHandler = (error, req, res, next) => {
    let apiError;
    if (error instanceof utils_1.ApiError) {
        apiError = error;
    }
    else if (error.isJoi) {
        apiError = utils_1.ApiError.fromJoi(error);
    }
    else if (error.name && error.name.startsWith('Sequelize')) {
        apiError = utils_1.ApiError.fromSequelize(error);
        logger_1.default.error('Database Error', Object.assign(Object.assign({}, (0, requestLogger_1.getRequestContext)(req)), { error: {
                name: error.name,
                message: error.message,
                sql: error.sql,
                parameters: error.parameters
            }, stack: error.stack }));
    }
    else {
        logger_1.default.error('Unexpected Error', Object.assign(Object.assign({}, (0, requestLogger_1.getRequestContext)(req)), { error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            } }));
        apiError = utils_1.ApiError.internal('Beklenmeyen bir hata oluştu');
    }
    apiError.path = req.originalUrl;
    const logLevel = apiError.statusCode >= 500 ? 'error' : 'warn';
    logger_1.default.log(logLevel, 'API Error Response', Object.assign(Object.assign({}, (0, requestLogger_1.getRequestContext)(req)), { error: {
            type: apiError.type,
            message: apiError.message,
            statusCode: apiError.statusCode,
            errors: apiError.errors
        } }));
    const responseData = {
        success: apiError.success || false,
        type: apiError.type || 'INTERNAL_SERVER_ERROR',
        message: apiError.message || 'Bilinmeyen hata',
        errors: apiError.errors,
        timestamp: apiError.timestamp || new Date().toISOString(),
        path: apiError.path || req.originalUrl
    };
    if (process.env.NODE_ENV === 'development' && error.stack) {
        responseData.stack = error.stack;
    }
    res.status(apiError.statusCode || 500).json(responseData);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    const apiError = utils_1.ApiError.notFound(`${req.originalUrl} endpoint'i bulunamadı`);
    apiError.path = req.originalUrl;
    logger_1.default.warn('404 Not Found', Object.assign(Object.assign({}, (0, requestLogger_1.getRequestContext)(req)), { endpoint: req.originalUrl }));
    const responseData = {
        success: false,
        type: apiError.type,
        message: apiError.message,
        errors: apiError.errors,
        timestamp: apiError.timestamp,
        path: apiError.path
    };
    res.status(404).json(responseData);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map