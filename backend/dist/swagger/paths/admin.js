"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminPaths = void 0;
exports.adminPaths = {
    '/admin/super/create': {
        post: {
            tags: ['Admin'],
            summary: 'Super admin ile admin oluştur',
            description: 'Super admin yetkileri ile yeni admin oluşturur',
            security: [{ apiKeyAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateAdminRequest' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Admin başarıyla oluşturuldu',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateAdminResponse' }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                409: {
                    description: 'Username veya email zaten kullanımda',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    }
};
//# sourceMappingURL=admin.js.map