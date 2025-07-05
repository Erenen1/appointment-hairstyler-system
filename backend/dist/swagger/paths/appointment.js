"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentPaths = void 0;
exports.appointmentPaths = {
    '/appointments': {
        get: {
            tags: ['Appointments'],
            summary: 'Randevuları listele',
            description: 'Filtreleme ve sıralama seçenekleri ile randevuları listeler',
            security: [{ sessionAuth: [] }],
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } },
                { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
                { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
                { name: 'staffId', in: 'query', schema: { type: 'integer' } },
                { name: 'customerId', in: 'query', schema: { type: 'integer' } },
                { name: 'serviceId', in: 'query', schema: { type: 'integer' } },
                {
                    name: 'sortBy',
                    in: 'query',
                    schema: {
                        type: 'string',
                        enum: ['appointmentDate', 'createdAt', 'customer_name', 'service_name'],
                        default: 'appointmentDate'
                    }
                },
                {
                    name: 'sortOrder',
                    in: 'query',
                    schema: {
                        type: 'string',
                        enum: ['asc', 'desc'],
                        default: 'asc'
                    }
                }
            ],
            responses: {
                200: {
                    description: 'Randevular başarıyla listelendi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Randevu listesi başarıyla getirildi' },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/Appointment' }
                                    },
                                    pagination: { $ref: '#/components/schemas/Pagination' },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        },
        post: {
            tags: ['Appointments'],
            summary: 'Yeni randevu oluştur',
            description: 'Müşteri ve randevu bilgileri ile yeni randevu oluşturur',
            security: [{ sessionAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateAppointmentRequest' }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Randevu başarıyla oluşturuldu',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Randevu başarıyla oluşturuldu' },
                                    data: { $ref: '#/components/schemas/Appointment' },
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
                    description: 'Zaman çakışması',
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
    '/appointments/calendar': {
        get: {
            tags: ['Appointments'],
            summary: 'Takvim randevuları',
            description: 'Belirtilen tarih aralığındaki randevuları takvim formatında getirir',
            security: [{ sessionAuth: [] }],
            parameters: [
                {
                    name: 'startDate',
                    in: 'query',
                    required: true,
                    schema: { type: 'string', format: 'date' },
                    description: 'Başlangıç tarihi'
                },
                {
                    name: 'endDate',
                    in: 'query',
                    required: true,
                    schema: { type: 'string', format: 'date' },
                    description: 'Bitiş tarihi'
                }
            ],
            responses: {
                200: {
                    description: 'Takvim randevuları başarıyla getirildi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Takvim randevuları başarıyla getirildi' },
                                    data: {
                                        type: 'array',
                                        items: { $ref: '#/components/schemas/CalendarEvent' }
                                    },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                400: { $ref: '#/components/responses/ValidationError' },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                500: { $ref: '#/components/responses/InternalError' }
            }
        }
    },
    '/appointments/{id}': {
        get: {
            tags: ['Appointments'],
            summary: 'Randevu detayı',
            description: 'Belirtilen ID\'ye sahip randevunun detaylarını getirir',
            security: [{ sessionAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' },
                    description: 'Randevu ID\'si'
                }
            ],
            responses: {
                200: {
                    description: 'Randevu detayı başarıyla getirildi',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'Randevu detayı başarıyla getirildi' },
                                    data: { $ref: '#/components/schemas/Appointment' },
                                    timestamp: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                401: { $ref: '#/components/responses/UnauthorizedError' },
                403: { $ref: '#/components/responses/ForbiddenError' },
                404: {
                    description: 'Randevu bulunamadı',
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
//# sourceMappingURL=appointment.js.map