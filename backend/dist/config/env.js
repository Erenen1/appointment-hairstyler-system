"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: `.env.${process.env.NODE_ENV || "development"}`
});
exports.config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_NAME: process.env.DB_NAME || 'kuafor_db',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password123',
    PORT: parseInt(process.env.PORT || '3000', 10),
    JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    SUPER_ADMIN_API_KEY: process.env.SUPER_ADMIN_API_KEY || 'your-api-key',
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    DOMAIN: process.env.DOMAIN || 'localhost',
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
exports.default = exports.config;
//# sourceMappingURL=env.js.map