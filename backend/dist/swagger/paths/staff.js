"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffPaths = void 0;
exports.staffPaths = {
    [`/staff`]: {
        get: {
            tags: ['Staff'],
            summary: 'Tüm personeli getir',
            description: 'Tüm personelin listesini sayfalama ve arama seçenekleriyle getirir.',
            parameters: [
                { $ref: '#/components/schemas/PageQuery' },
                { $ref: '#/components/schemas/LimitQuery' },
                { $ref: '#/components/schemas/SearchQuery' },
            ],
            responses: {
                '200': {
                    description: 'Personel başarıyla getirildi.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/StaffListResponse',
                            },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
        post: {
            tags: ['Staff'],
            summary: 'Yeni personel oluştur',
            description: 'Yeni bir personel oluşturmak için kullanılır.',
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/CreateStaffRequest',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Personel başarıyla oluşturuldu.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Staff',
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
    [`/staff/{id}`]: {
        get: {
            tags: ['Staff'],
            summary: 'Belirli bir personeli getir',
            description: 'Belirtilen ID\'ye sahip personeli getirir.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
            ],
            responses: {
                '200': {
                    description: 'Personel başarıyla getirildi.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Staff',
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
            tags: ['Staff'],
            summary: 'Personeli güncelle',
            description: 'Belirtilen ID\'ye sahip personeli günceller.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
            ],
            requestBody: {
                required: true,
                content: {
                    'multipart/form-data': {
                        schema: {
                            $ref: '#/components/schemas/UpdateStaffRequest',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Personel başarıyla güncellendi.',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Staff',
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
            tags: ['Staff'],
            summary: 'Personeli sil',
            description: 'Belirtilen ID\'ye sahip personeli siler.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
            ],
            responses: {
                '204': {
                    description: 'Personel başarıyla silindi (İçerik Yok).',
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '404': { $ref: '#/components/responses/NotFoundError' },
                '500': { $ref: '#/components/responses/InternalServerError' },
            },
        },
    },
    [`/staff/{id}/available-slots`]: {
        get: {
            tags: ['Staff'],
            summary: 'Belirli bir personel için müsait zaman aralıklarını getir',
            description: 'Belirtilen personel ID\'si ve tarihi için müsait zaman aralıklarını getirir.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
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
                                $ref: '#/components/schemas/AvailableSlotsResponse',
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
    [`/staff/{id}/available-slots-range`]: {
        get: {
            tags: ['Staff'],
            summary: 'Belirli bir personel için zaman aralığında müsait zaman aralıklarını getir',
            description: 'Belirtilen personel ID\'si ve tarih aralığı için müsait zaman aralıklarını getirir.',
            parameters: [
                { $ref: '#/components/schemas/IdParam' },
                {
                    name: 'startDate',
                    in: 'query',
                    description: 'Başlangıç tarihi (YYYY-MM-DD)',
                    required: true,
                    schema: { type: 'string', format: 'date' },
                },
                {
                    name: 'endDate',
                    in: 'query',
                    description: 'Bitiş tarihi (YYYY-MM-DD)',
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
                                $ref: '#/components/schemas/AvailableSlotsRangeResponse',
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
//# sourceMappingURL=staff.js.map