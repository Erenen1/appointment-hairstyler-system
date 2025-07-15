"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceSchemas = void 0;
exports.serviceSchemas = {
    ServiceCategory: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            name: { type: 'string', example: 'Saç Bakımı' },
            description: { type: 'string', example: 'Saç bakım hizmetleri' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    Service: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            categoryId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            slug: { type: 'string', example: 'sac-kesimi' },
            title: { type: 'string', example: 'Saç Kesimi' },
            description: { type: 'string', example: 'Profesyonel saç kesimi hizmeti' },
            duration: { type: 'integer', example: 60 },
            price: { type: 'number', format: 'decimal', example: 100.00 },
            image: { type: 'string', format: 'uri', example: 'https://example.com/service-image.jpg' },
            isActive: { type: 'boolean', example: true },
            isPopular: { type: 'boolean', example: false },
            category: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                    name: { type: 'string', example: 'Saç Bakımı' },
                    description: { type: 'string', example: 'Saç bakım hizmetleri' }
                }
            },
            images: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                        imagePath: { type: 'string', format: 'uri', example: 'https://example.com/service-image.jpg' },
                        isMain: { type: 'boolean', example: true },
                        orderIndex: { type: 'integer', example: 0 }
                    }
                }
            },
            staffMembers: {
                type: 'array',
                items: { $ref: '#/components/schemas/ServiceStaffMember' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    ServiceStaffMember: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            fullName: { type: 'string', example: 'Ahmet Yılmaz' },
            specialties: { type: 'string', example: 'Saç kesimi, sakal tıraşı' },
            avatar: { type: 'string', format: 'uri', example: 'https://example.com/avatar.jpg' },
            canProvideService: { type: 'boolean', example: true }
        }
    },
    CreateServiceRequest: {
        type: 'object',
        required: ['categoryId', 'title', 'duration', 'price', 'staffIds'],
        properties: {
            categoryId: {
                type: 'string',
                format: 'uuid',
                example: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Kategori ID geçerli UUID formatında olmalıdır'
            },
            slug: {
                type: 'string',
                minLength: 2,
                maxLength: 255,
                example: 'sac-kesimi',
                description: 'URL dostu slug'
            },
            title: {
                type: 'string',
                minLength: 2,
                maxLength: 255,
                example: 'Saç Kesimi',
                description: 'Hizmet başlığı 2-255 karakter arasında olmalıdır'
            },
            description: {
                type: 'string',
                maxLength: 1000,
                example: 'Profesyonel saç kesimi hizmeti',
                description: 'Açıklama en fazla 1000 karakter olabilir'
            },
            duration: {
                type: 'integer',
                minimum: 0,
                maximum: 1000,
                example: 60,
                description: 'Hizmet süresi dakika cinsinden'
            },
            price: {
                type: 'number',
                format: 'decimal',
                minimum: 0,
                maximum: 1000000,
                example: 100.00,
                description: 'Hizmet fiyatı'
            },
            staffIds: {
                type: 'string',
                example: '["123e4567-e89b-12d3-a456-426614174000", "456e7890-e12b-34d5-a678-901234567890"]',
                description: 'JSON string formatında staff ID dizisi'
            },
            isPopular: {
                type: 'boolean',
                example: false,
                description: 'Popüler hizmet mi?'
            },
            isActive: {
                type: 'boolean',
                example: true,
                description: 'Hizmet aktif mi?'
            }
        }
    },
    UpdateServiceRequest: {
        type: 'object',
        properties: {
            categoryId: {
                type: 'string',
                format: 'uuid',
                example: '123e4567-e89b-12d3-a456-426614174000',
                description: 'Kategori ID geçerli UUID formatında olmalıdır'
            },
            slug: {
                type: 'string',
                minLength: 2,
                maxLength: 255,
                example: 'sac-kesimi',
                description: 'URL dostu slug'
            },
            title: {
                type: 'string',
                minLength: 2,
                maxLength: 255,
                example: 'Saç Kesimi',
                description: 'Hizmet başlığı 2-255 karakter arasında olmalıdır'
            },
            description: {
                type: 'string',
                maxLength: 1000,
                example: 'Profesyonel saç kesimi hizmeti',
                description: 'Açıklama en fazla 1000 karakter olabilir'
            },
            duration: {
                type: 'integer',
                minimum: 0,
                maximum: 1000,
                example: 60,
                description: 'Hizmet süresi dakika cinsinden'
            },
            price: {
                type: 'number',
                format: 'decimal',
                minimum: 0,
                maximum: 1000000,
                example: 100.00,
                description: 'Hizmet fiyatı'
            },
            staffIds: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
                minItems: 0,
                example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e12b-34d5-a678-901234567890'],
                description: 'Hizmeti verebilecek personel ID\'leri'
            },
            isPopular: {
                type: 'boolean',
                example: false,
                description: 'Popüler hizmet mi?'
            },
            isActive: {
                type: 'boolean',
                example: true,
                description: 'Hizmet aktif mi?'
            }
        }
    },
    CreateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
            name: {
                type: 'string',
                minLength: 2,
                maxLength: 100,
                example: 'Saç Bakımı',
                description: 'Kategori adı 2-100 karakter arasında olmalıdır'
            },
            description: {
                type: 'string',
                maxLength: 500,
                example: 'Saç bakım hizmetleri',
                description: 'Açıklama en fazla 500 karakter olabilir'
            }
        }
    },
    UpdateCategoryRequest: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 2,
                maxLength: 100,
                example: 'Saç Bakımı',
                description: 'Kategori adı 2-100 karakter arasında olmalıdır'
            },
            description: {
                type: 'string',
                maxLength: 500,
                example: 'Saç bakım hizmetleri',
                description: 'Açıklama en fazla 500 karakter olabilir'
            },
            isActive: {
                type: 'boolean',
                example: true,
                description: 'Kategori aktif mi?'
            }
        }
    },
    ServiceStaffAvailabilityResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Hizmet personellerinin müsaitlik durumları başarıyla getirildi' },
            data: {
                type: 'object',
                properties: {
                    service: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                            title: { type: 'string', example: 'Saç Kesimi' },
                            duration: { type: 'integer', example: 60 },
                            price: { type: 'number', format: 'decimal', example: 100.00 }
                        }
                    },
                    dateRange: {
                        type: 'object',
                        properties: {
                            startDate: { type: 'string', format: 'date', example: '2024-01-15' },
                            endDate: { type: 'string', format: 'date', example: '2024-01-21' },
                            totalDays: { type: 'integer', example: 7 }
                        }
                    },
                    staffAvailabilities: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                staff: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
                                        fullName: { type: 'string', example: 'Mehmet Özkan' },
                                        specialties: { type: 'string', example: 'Saç Kesimi ve Boyama' },
                                        avatar: { type: 'string', nullable: true, example: 'https://example.com/avatar.jpg' }
                                    }
                                },
                                summary: {
                                    type: 'object',
                                    properties: {
                                        totalDays: { type: 'integer', example: 7 },
                                        availableDays: { type: 'integer', example: 5 },
                                        totalAvailableSlots: { type: 'integer', example: 60 },
                                        averageSlotsPerDay: { type: 'integer', example: 12 }
                                    }
                                },
                                dailyAvailability: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            date: { type: 'string', format: 'date', example: '2024-01-15' },
                                            dayOfWeek: { type: 'integer', example: 1 },
                                            isAvailable: { type: 'boolean', example: true },
                                            reason: { type: 'string', nullable: true, example: 'Personel bu tarihte müsait değil' },
                                            availableSlots: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/AvailableSlot' }
                                            },
                                            totalSlots: { type: 'integer', example: 12 },
                                            workingHours: {
                                                type: 'object',
                                                nullable: true,
                                                properties: {
                                                    start: { type: 'string', example: '09:00' },
                                                    end: { type: 'string', example: '18:00' },
                                                    lunchBreak: { type: 'string', nullable: true, example: '12:00 - 13:00' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            timestamp: { type: 'string', format: 'date-time' }
        }
    }
};
//# sourceMappingURL=service.js.map