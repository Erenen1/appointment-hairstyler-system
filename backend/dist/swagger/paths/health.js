"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthPaths = void 0;
exports.healthPaths = {
    '/health': {
        get: {
            tags: ['Health'],
            summary: 'Sistem sağlık durumu',
            description: 'Sistemin genel sağlık durumunu kontrol eder',
            responses: {
                200: {
                    description: 'Sistem sağlıklı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/HealthResponse' }
                        }
                    }
                }
            }
        }
    },
    '/health/database': {
        get: {
            tags: ['Health'],
            summary: 'Veritabanı sağlık durumu',
            responses: {
                200: {
                    description: 'Veritabanı sağlıklı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiSuccessResponse' }
                        }
                    }
                }
            }
        }
    },
    '/health/server': {
        get: {
            tags: ['Health'],
            summary: 'Server bilgileri',
            responses: {
                200: {
                    description: 'Server bilgileri',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ServerInfoResponse' }
                        }
                    }
                }
            }
        }
    },
    '/health/liveness': {
        get: {
            tags: ['Health'],
            summary: 'Liveness probe',
            responses: {
                200: {
                    description: 'Service alive',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LivenessResponse' }
                        }
                    }
                }
            }
        }
    },
    '/health/readiness': {
        get: {
            tags: ['Health'],
            summary: 'Readiness probe',
            responses: {
                200: {
                    description: 'Service ready',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ReadinessResponse' }
                        }
                    }
                }
            }
        }
    }
};
//# sourceMappingURL=health.js.map