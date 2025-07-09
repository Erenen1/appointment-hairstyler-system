"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPaths = void 0;
exports.authPaths = {
    '/auth/admin/login': {
        post: {
            tags: ['Authentication'],
            summary: 'Admin girişi',
            description: 'Admin kullanıcısı email ve şifre ile giriş yapar. Başarılı girişte JWT token döner.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoginRequest' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Giriş başarılı - JWT token döndürüldü',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginResponse' }
                        }
                    }
                },
                401: {
                    description: 'Geçersiz kimlik bilgileri',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    },
    '/auth/logout': {
        post: {
            tags: ['Authentication'],
            summary: 'Çıkış yap',
            description: 'JWT token ile çıkış işlemi. Client-side\'da token silinmelidir.',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Çıkış başarılı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LogoutResponse' }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    },
    '/auth/profile': {
        get: {
            tags: ['Authentication'],
            summary: 'Mevcut kullanıcı bilgisi',
            description: 'JWT token\'dan kullanıcı bilgilerini döner',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Kullanıcı bilgileri',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ProfileResponse' }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    }
};
//# sourceMappingURL=auth.js.map