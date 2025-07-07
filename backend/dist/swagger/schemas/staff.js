"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffSchemas = void 0;
exports.staffSchemas = {
    StaffBasic: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            fullName: { type: 'string', example: 'Mehmet Özkan' },
            avatar: { type: 'string', nullable: true, example: 'https://example.com/avatar.jpg' }
        }
    },
    Staff: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            fullName: { type: 'string', example: 'Mehmet Özkan' },
            email: { type: 'string', format: 'email', example: 'mehmet@salon.com' },
            phone: { type: 'string', example: '+90 555 987 6543' },
            avatar: { type: 'string', nullable: true, example: 'https://example.com/avatar.jpg' },
            specialties: { type: 'string', example: 'Saç Kesimi ve Boyama' },
            isActive: { type: 'boolean', example: true },
            services: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        title: { type: 'string', example: 'Saç Kesimi' },
                        price: { type: 'number', format: 'decimal', example: 100.00 },
                        duration: { type: 'integer', example: 60 },
                        category: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 1 },
                                name: { type: 'string', example: 'Saç Bakımı' }
                            }
                        }
                    }
                }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    CreateStaffRequest: {
        type: 'object',
        required: ['fullName', 'email', 'phone', 'specialties'],
        properties: {
            fullName: { type: 'string', minLength: 2, maxLength: 100, example: 'Mehmet Özkan' },
            email: { type: 'string', format: 'email', example: 'mehmet@salon.com' },
            phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 987 6543' },
            specialties: { type: 'string', minLength: 2, maxLength: 200, example: 'Saç Kesimi ve Boyama' },
            serviceIds: {
                type: 'array',
                items: { type: 'integer' },
                minItems: 0,
                example: [1, 2, 3]
            },
            avatar: { type: 'string', format: 'uri', example: 'https://example.com/avatar.jpg' }
        }
    },
    UpdateStaffRequest: {
        type: 'object',
        properties: {
            fullName: { type: 'string', minLength: 2, maxLength: 100, example: 'Mehmet Özkan' },
            email: { type: 'string', format: 'email', example: 'mehmet@salon.com' },
            phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 987 6543' },
            specialties: { type: 'string', minLength: 2, maxLength: 200, example: 'Saç Kesimi ve Boyama' },
            serviceIds: {
                type: 'array',
                items: { type: 'integer' },
                minItems: 0,
                example: [1, 2, 3]
            },
            avatar: { type: 'string', format: 'uri', example: 'https://example.com/avatar.jpg' },
            isActive: { type: 'boolean', example: true }
        }
    },
    AvailableSlot: {
        type: 'object',
        properties: {
            time: { type: 'string', example: '09:00' },
            displayTime: { type: 'string', example: '09:00' },
            available: { type: 'boolean', example: true }
        }
    },
    AvailableSlotsResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Müsait saatler başarıyla getirildi' },
            data: {
                type: 'object',
                properties: {
                    date: { type: 'string', format: 'date', example: '2024-01-15' },
                    staffId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    staffName: { type: 'string', example: 'Mehmet Özkan' },
                    isAvailable: { type: 'boolean', example: true },
                    availableSlots: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/AvailableSlot' }
                    },
                    totalSlots: { type: 'integer', example: 12 },
                    workingHours: {
                        type: 'object',
                        properties: {
                            start: { type: 'string', example: '09:00' },
                            end: { type: 'string', example: '18:00' },
                            lunchBreak: { type: 'string', nullable: true, example: '12:00 - 13:00' }
                        }
                    },
                    existingAppointments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                startTime: { type: 'string', example: '10:00' },
                                endTime: { type: 'string', example: '11:00' }
                            }
                        }
                    },
                    reason: { type: 'string', nullable: true, example: 'Personel bu tarihte müsait değil' }
                }
            },
            timestamp: { type: 'string', format: 'date-time' }
        }
    }
};
//# sourceMappingURL=staff.js.map