"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactPaths = void 0;
exports.contactPaths = {
    '/contact/messages': {
        get: {
            tags: ['Contact'],
            summary: 'İletişim mesajlarını listele',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } },
                { name: 'isRead', in: 'query', schema: { type: 'boolean' } }
            ],
            responses: {
                200: {
                    description: 'İletişim mesajları başarıyla listelendi',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactMessageListResponse' } } }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        post: {
            tags: ['Contact'],
            summary: 'Yeni iletişim mesajı gönder',
            requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateContactMessageRequest' } } }
            },
            responses: {
                201: {
                    description: 'Mesaj başarıyla gönderildi',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccessResponse' } } }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    },
    '/contact/messages/{id}': {
        get: {
            tags: ['Contact'],
            summary: 'İletişim mesajı detayı',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            responses: {
                200: {
                    description: 'Mesaj detayı getirildi',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccessResponse' } } }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                404: { description: 'Mesaj bulunamadı' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        put: {
            tags: ['Contact'],
            summary: 'İletişim mesajı durumunu güncelle',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['status'],
                            properties: {
                                status: {
                                    type: 'string',
                                    enum: ['read', 'replied', 'closed'],
                                    example: 'read'
                                },
                                adminNotes: {
                                    type: 'string',
                                    maxLength: 1000,
                                    example: 'Müşteri ile iletişime geçildi'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Mesaj durumu başarıyla güncellendi',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiSuccessResponse' } } }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                404: { description: 'Mesaj bulunamadı' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        delete: {
            tags: ['Contact'],
            summary: 'İletişim mesajını sil',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            responses: {
                200: { description: 'Mesaj başarıyla silindi' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                404: { description: 'Mesaj bulunamadı' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    },
    '/contact/stats': {
        get: {
            tags: ['Contact'],
            summary: 'İletişim istatistikleri',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'İstatistikler getirildi',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ContactStatsResponse' } } }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    }
};
//# sourceMappingURL=contact.js.map