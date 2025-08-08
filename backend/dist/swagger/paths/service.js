"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicePaths = void 0;
exports.servicePaths = {
    [`/services`]: {
        get: {
            tags: ['Services'],
            summary: 'Tüm hizmetleri getir',
            description: 'Tüm hizmetlerin listesini sayfalama ve arama seçenekleriyle getirir.',
            parameters: [
                { $ref: '#/components/schemas/PageQuery' },
                { $ref: '#/components/schemas/LimitQuery' },
                { $ref: '#/components/schemas/SearchQuery' },
                {
                    name: 'categoryId',
                    in: 'query',
                    description: 'Kategori ID"si ile filtrele (isteğe bağlı)',
                    required: false,
                    schema: { type: 'string', format: 'uuid' },
                },
            ],
            responses: {
                '200': {
                    description: 'Hizmetler başarıyla getirildi.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ServiceListResponse',
                            },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
        post: {
            tags: ['Services'],
            summary: 'Yeni hizmet oluştur',
            description: 'Yeni bir hizmet oluşturmak için kullanılır.',
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/CreateServiceRequest',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Hizmet başarıyla oluşturuldu.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Service',
                            },
                        },
                    },
                },
                '400': { $ref: '#/components/responses/ValidationError' },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
    },
    [`/services/{id}`]: {
        get: {
            tags: ['Services'],
            summary: 'Belirli bir hizmeti getir',
            description: 'Belirtilen ID"ye sahip hizmeti getirir.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
            ],
            responses: {
                '200': {
                    description: 'Hizmet başarıyla getirildi.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Service',
                            },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '404': { $ref: '#/components/responses/NotFoundError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
        put: {
            tags: ['Services'],
            summary: 'Hizmeti güncelle',
            description: 'Belirtilen ID"ye sahip hizmeti günceller.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
            ],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/UpdateServiceRequest',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Hizmet başarıyla güncellendi.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Service',
                            },
                        },
                    },
                },
                '400': { $ref: '#/components/responses/ValidationError' },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '404': { $ref: '#/components/responses/NotFoundError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
        delete: {
            tags: ['Services'],
            summary: 'Hizmeti sil',
            description: 'Belirtilen ID"ye sahip hizmeti siler.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
            ],
            responses: {
                '204': {
                    description: 'Hizmet başarıyla silindi (İçerik Yok).',
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '404': { $ref: '#/components/responses/NotFoundError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
    },
    [`/services/categories`]: {
        get: {
            tags: ['Services'],
            summary: 'Tüm hizmet kategorilerini getir',
            description: 'Tüm hizmet kategorilerinin listesini getirir.',
            responses: {
                '200': {
                    description: 'Hizmet kategorileri başarıyla getirildi.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/ServiceCategory' },
                            },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
    },
    [`/services/{id}/staff`]: {
        get: {
            tags: ['Services'],
            summary: 'Bir hizmet için uygun personeli getir',
            description: 'Belirtilen hizmeti sunabilen personelin listesini getirir.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
            ],
            responses: {
                '200': {
                    description: 'Uygun personel başarıyla getirildi.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/ServiceStaffMember' },
                            },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '404': { $ref: '#/components/responses/NotFoundError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
    },
    [`/services/{id}/staff-availability`]: {
        get: {
            tags: ['Services'],
            summary: 'Bir hizmet ve personel için müsaitlik getir',
            description: 'Belirli bir hizmet ve personel için müsait zaman aralıklarını getirir.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
                {
                    name: 'staffId',
                    in: 'query',
                    description: 'Personel ID"si',
                    required: true,
                    schema: { type: 'string', format: 'uuid' },
                },
                {
                    name: 'date',
                    in: 'query',
                    description: 'Müsaitlik tarihi (YYYY-MM-DD)',
                    required: true,
                    schema: { type: 'string', format: 'date' },
                },
            ],
            responses: {
                '200': {
                    description: 'Müsait zaman aralıkları başarıyla getirildi.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ServiceStaffAvailabilityResponse',
                            },
                        },
                    },
                },
                '400': { $ref: '#/components/responses/ValidationError' },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '404': { $ref: '#/components/responses/NotFoundError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
    },
};
//# sourceMappingURL=service.js.map