"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthPaths = void 0;
const env_1 = __importDefault(require("../../config/env"));
exports.healthPaths = {
    [`${env_1.default.API_PREFIX}/health`]: {
        get: {
            tags: ['Health'],
            summary: 'API sağlık kontrolü',
            description: 'API"nin çalışır durumda olup olmadığını kontrol eder.',
            responses: {
                '200': {
                    description: 'API çalışıyor.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'ok' },
                                    timestamp: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Sunucu hatası. API düzgün çalışmıyor.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    },
    [`${env_1.default.API_PREFIX}/health/database`]: {
        get: {
            tags: ['Health'],
            summary: 'Veritabanı sağlık kontrolü',
            description: 'Veritabanı bağlantısının çalışır durumda olup olmadığını kontrol eder.',
            responses: {
                '200': {
                    description: 'Veritabanı bağlantısı başarılı.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: { type: 'string', example: 'ok' },
                                    message: { type: 'string', example: 'Veritabanı bağlantısı başarılı.' },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Sunucu hatası. Veritabanı bağlantısı başarısız.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error',
                            },
                        },
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=health.js.map