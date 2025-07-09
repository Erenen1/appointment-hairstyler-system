"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerPaths = void 0;
exports.customerPaths = {
    '/customers': {
        get: {
            tags: ['Customers'],
            summary: 'Müşterileri listele',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    description: 'Sayfa numarası',
                    required: false,
                    schema: { type: 'integer', minimum: 1, default: 1 }
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Sayfa başına kayıt sayısı',
                    required: false,
                    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'İsim, telefon veya email ile arama',
                    required: false,
                    schema: { type: 'string' }
                }
            ],
            responses: {
                200: {
                    description: 'Müşteriler başarıyla listelendi',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CustomerListResponse' }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        post: {
            tags: ['Customers'],
            summary: 'Yeni müşteri oluştur',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateCustomerRequest' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Müşteri başarıyla oluşturuldu',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Müşteri başarıyla oluşturuldu' },
                                    data: { $ref: '#/components/schemas/Customer' },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                409: {
                    description: 'Telefon veya email zaten kullanımda',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    },
    '/customers/{id}': {
        get: {
            tags: ['Customers'],
            summary: 'Müşteri detayı',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }
            ],
            responses: {
                200: {
                    description: 'Müşteri detayı',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Müşteri detayı getirildi' },
                                    data: { $ref: '#/components/schemas/Customer' },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                404: {
                    description: 'Müşteri bulunamadı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        put: {
            tags: ['Customers'],
            summary: 'Müşteri güncelle',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateCustomerRequest' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Müşteri başarıyla güncellendi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Müşteri başarıyla güncellendi' },
                                    data: { $ref: '#/components/schemas/Customer' },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                404: {
                    description: 'Müşteri bulunamadı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                409: {
                    description: 'Telefon veya email zaten kullanımda',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        delete: {
            tags: ['Customers'],
            summary: 'Müşteri sil',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }
            ],
            responses: {
                200: {
                    description: 'Müşteri başarıyla silindi',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiSuccessResponse' }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                404: {
                    description: 'Müşteri bulunamadı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                409: {
                    description: 'Müşteri aktif randevularda kullanılıyor',
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
//# sourceMappingURL=customer.js.map