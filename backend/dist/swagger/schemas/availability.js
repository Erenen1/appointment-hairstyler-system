"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilitySchemas = void 0;
exports.availabilitySchemas = {
    StaffAvailability: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            businessId: { type: 'string', format: 'uuid' },
            staffId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date' },
            startTime: { type: 'string', format: 'time' },
            endTime: { type: 'string', format: 'time' },
            isAvailable: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateAvailabilityRequest: {
        type: 'object',
        required: ['staffId', 'date', 'startTime', 'endTime'],
        properties: {
            staffId: { type: 'string', format: 'uuid', description: 'Personel ID"si' },
            date: { type: 'string', format: 'date', example: '2024-12-31' },
            startTime: { type: 'string', format: 'time', example: '09:00' },
            endTime: { type: 'string', format: 'time', example: '17:00' },
            isAvailable: { type: 'boolean', description: 'Müsait olup olmadığı (varsayılan: true)', default: true },
        },
    },
    UpdateAvailabilityRequest: {
        type: 'object',
        properties: {
            date: { type: 'string', format: 'date', example: '2024-12-31' },
            startTime: { type: 'string', format: 'time', example: '09:00' },
            endTime: { type: 'string', format: 'time', example: '17:00' },
            isAvailable: { type: 'boolean', description: 'Müsait olup olmadığı' },
        },
    },
    BulkCreateAvailabilityRequest: {
        type: 'object',
        required: ['staffId', 'dateRange', 'defaultStartTime', 'defaultEndTime'],
        properties: {
            staffId: { type: 'string', format: 'uuid', description: 'Personel ID"si' },
            dateRange: {
                type: 'array',
                items: { type: 'string', format: 'date' },
                description: 'Müsaitlik eklenmek istenen tarih aralığı (örn: ["2024-01-01", "2024-01-31"])',
                minItems: 2,
                maxItems: 2,
            },
            defaultStartTime: { type: 'string', format: 'time', example: '09:00', description: 'Varsayılan başlangıç saati' },
            defaultEndTime: { type: 'string', format: 'time', example: '17:00', description: 'Varsayılan bitiş saati' },
            excludeDates: {
                type: 'array',
                items: { type: 'string', format: 'date' },
                description: 'Müsaitlik eklenmek istenmeyen belirli tarihler (isteğe bağlı)',
            },
            includeDates: {
                type: 'array',
                items: { type: 'string', format: 'date' },
                description: 'Varsayılan olarak hariç tutulan günlerde müsaitlik eklemek için belirli tarihler (isteğe bağlı)',
            },
            applyToWeekdays: {
                type: 'array',
                items: { type: 'integer', minimum: 0, maximum: 6 },
                description: 'Müsaitliğin uygulanacağı haftanın günleri (0:Pazar, 1:Pazartesi, ..., 6:Cumartesi) (varsayılan: tüm günler)',
            },
        },
    },
    StaffAvailabilityWithAppointments: {
        type: 'object',
        properties: {
            availability: { $ref: '#/components/schemas/StaffAvailability' },
            appointments: {
                type: 'array',
                items: { type: 'string', format: 'time' },
                description: 'Bu müsaitlik bloğundaki randevu saatleri',
            },
        },
    },
    AllStaffAvailabilityResponse: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/StaffAvailabilityWithAppointments' },
            },
            pagination: { $ref: '#/components/schemas/PaginationResponse' },
        },
    },
};
//# sourceMappingURL=availability.js.map