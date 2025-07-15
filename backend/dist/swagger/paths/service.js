"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicePaths = void 0;
exports.servicePaths = {
    '/services': {
        get: {
            tags: ['Services'],
            summary: 'Hizmetleri listele',
            description: 'Tüm hizmetleri sayfalama ve filtreleme ile listeler',
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
                    description: 'Sayfa başına öğe sayısı',
                    required: false,
                    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'Arama terimi (başlık veya açıklama)',
                    required: false,
                    schema: { type: 'string' }
                },
                {
                    name: 'categoryId',
                    in: 'query',
                    description: 'Kategori ID ile filtreleme',
                    required: false,
                    schema: { type: 'string', format: 'uuid' }
                },
                {
                    name: 'isActive',
                    in: 'query',
                    description: 'Aktiflik durumu ile filtreleme',
                    required: false,
                    schema: { type: 'boolean' }
                }
            ],
            responses: {
                200: {
                    description: 'Hizmetler başarıyla listelendi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Hizmetler başarıyla listelendi' },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Service' }
                                    },
                                    pagination: {
                                        type: 'object',
                                        properties: {
                                            currentPage: { type: 'integer', example: 1 },
                                            totalPages: { type: 'integer', example: 5 },
                                            totalItems: { type: 'integer', example: 50 },
                                            itemsPerPage: { type: 'integer', example: 10 },
                                            hasNextPage: { type: 'boolean', example: true },
                                            hasPrevPage: { type: 'boolean', example: false }
                                        }
                                    },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        post: {
            tags: ['Services'],
            summary: 'Yeni hizmet oluştur',
            description: 'Yeni hizmet oluşturur ve personel ilişkilerini kurar',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            required: ['categoryId', 'title', 'duration', 'price', 'staffIds'],
                            properties: {
                                categoryId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                                slug: { type: 'string', minLength: 2, maxLength: 255, example: 'sac-kesimi' },
                                title: { type: 'string', minLength: 2, maxLength: 255, example: 'Saç Kesimi' },
                                description: { type: 'string', maxLength: 1000, example: 'Profesyonel saç kesimi hizmeti' },
                                duration: { type: 'integer', minimum: 0, maximum: 1000, example: 60 },
                                price: { type: 'number', format: 'decimal', minimum: 0, maximum: 1000000, example: 100.00 },
                                staffIds: {
                                    type: 'string',
                                    example: '["123e4567-e89b-12d3-a456-426614174000", "456e7890-e12b-34d5-a678-901234567890"]',
                                    description: 'JSON string formatında staff ID dizisi'
                                },
                                isPopular: { type: 'boolean', example: false },
                                isActive: { type: 'boolean', example: true },
                                image: { type: 'string', format: 'binary', description: 'Hizmet resmi dosyası' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Hizmet başarıyla oluşturuldu',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Hizmet başarıyla oluşturuldu' },
                                    data: { $ref: '#/components/schemas/Service' },
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
                    description: 'Kategori bulunamadı',
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
    '/services/categories': {
        get: {
            tags: ['Services'],
            summary: 'Hizmet kategorilerini listele',
            description: 'Tüm hizmet kategorilerini listeler',
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
                    description: 'Sayfa başına öğe sayısı',
                    required: false,
                    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
                },
                {
                    name: 'search',
                    in: 'query',
                    description: 'Arama terimi',
                    required: false,
                    schema: { type: 'string' }
                },
                {
                    name: 'isActive',
                    in: 'query',
                    description: 'Aktiflik durumu ile filtreleme',
                    required: false,
                    schema: { type: 'boolean' }
                }
            ],
            responses: {
                200: {
                    description: 'Kategoriler başarıyla listelendi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Kategoriler başarıyla listelendi' },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/ServiceCategory' }
                                    },
                                    pagination: {
                                        type: 'object',
                                        properties: {
                                            currentPage: { type: 'integer', example: 1 },
                                            totalPages: { type: 'integer', example: 5 },
                                            totalItems: { type: 'integer', example: 50 },
                                            itemsPerPage: { type: 'integer', example: 10 },
                                            hasNextPage: { type: 'boolean', example: true },
                                            hasPrevPage: { type: 'boolean', example: false }
                                        }
                                    },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        post: {
            tags: ['Services'],
            summary: 'Yeni kategori oluştur',
            description: 'Yeni hizmet kategorisi oluşturur',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateCategoryRequest' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Kategori başarıyla oluşturuldu',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Kategori başarıyla oluşturuldu' },
                                    data: { $ref: '#/components/schemas/ServiceCategory' },
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
                    description: 'Bu isimde bir kategori zaten mevcut',
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
    '/services/{id}': {
        get: {
            tags: ['Services'],
            summary: 'Hizmet detayı',
            description: 'Belirtilen ID\'ye sahip hizmetin detaylarını getirir',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Hizmet ID\'si',
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            responses: {
                200: {
                    description: 'Hizmet detayları başarıyla getirildi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Hizmet detayları başarıyla getirildi' },
                                    data: { $ref: '#/components/schemas/Service' },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                404: {
                    description: 'Hizmet bulunamadı',
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
            tags: ['Services'],
            summary: 'Hizmet güncelle',
            description: 'Hizmet bilgilerini günceller ve personel ilişkilerini yeniden kurar',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Hizmet ID\'si',
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateServiceRequest' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Hizmet başarıyla güncellendi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Hizmet başarıyla güncellendi' },
                                    data: { $ref: '#/components/schemas/Service' },
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
                    description: 'Hizmet bulunamadı',
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
            tags: ['Services'],
            summary: 'Hizmet sil',
            description: 'Hizmeti siler (aktif randevularda kullanılmıyorsa)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Hizmet ID\'si',
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            responses: {
                200: {
                    description: 'Hizmet başarıyla silindi',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiSuccessResponse' }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                404: {
                    description: 'Hizmet bulunamadı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                409: {
                    description: 'Hizmet aktif randevularda kullanılıyor',
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
    '/services/{id}/staff': {
        get: {
            tags: ['Services'],
            summary: 'Hizmeti veren personelleri getir',
            description: 'Belirli bir hizmeti verebilen aktif personelleri listeler',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Hizmet ID\'si',
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            responses: {
                200: {
                    description: 'Hizmeti veren personeller başarıyla getirildi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Hizmeti veren personeller başarıyla getirildi' },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/ServiceStaffMember' }
                                    },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                404: {
                    description: 'Hizmet bulunamadı',
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
    '/services/{id}/staff-availability': {
        get: {
            tags: ['Services'],
            summary: 'Hizmet personellerinin müsaitlik durumu',
            description: 'Belirtilen tarih aralığında hizmeti verebilen personellerin müsaitlik durumlarını getirir',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Hizmet ID\'si',
                    schema: { type: 'string', format: 'uuid' }
                },
                {
                    name: 'startDate',
                    in: 'query',
                    required: true,
                    description: 'Başlangıç tarihi',
                    schema: { type: 'string', format: 'date' }
                },
                {
                    name: 'endDate',
                    in: 'query',
                    required: true,
                    description: 'Bitiş tarihi',
                    schema: { type: 'string', format: 'date' }
                }
            ],
            responses: {
                200: {
                    description: 'Hizmet personellerinin müsaitlik durumları başarıyla getirildi',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ServiceStaffAvailabilityResponse' }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                404: {
                    description: 'Hizmet bulunamadı',
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
    '/services/categories/{id}': {
        put: {
            tags: ['Services'],
            summary: 'Kategori güncelle',
            description: 'Hizmet kategorisini günceller',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Kategori ID\'si',
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateCategoryRequest' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Kategori başarıyla güncellendi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Hizmet kategorisi başarıyla güncellendi' },
                                    data: { $ref: '#/components/schemas/ServiceCategory' },
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
                    description: 'Kategori bulunamadı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                409: {
                    description: 'Bu isimde bir kategori zaten mevcut',
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
            tags: ['Services'],
            summary: 'Kategori sil',
            description: 'Hizmet kategorisini siler (hizmetlerde kullanılmıyorsa)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'Kategori ID\'si',
                    schema: { type: 'string', format: 'uuid' }
                }
            ],
            responses: {
                200: {
                    description: 'Kategori başarıyla silindi',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ApiSuccessResponse' }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                404: {
                    description: 'Kategori bulunamadı',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                409: {
                    description: 'Kategori hizmetlerde kullanılıyor',
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
//# sourceMappingURL=service.js.map