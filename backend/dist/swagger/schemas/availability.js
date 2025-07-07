"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllStaffAvailabilityResponseSchema = exports.StaffAvailabilityWithAppointmentsSchema = exports.BulkCreateAvailabilitySchema = exports.UpdateAvailabilitySchema = exports.CreateAvailabilitySchema = exports.StaffAvailabilitySchema = void 0;
exports.StaffAvailabilitySchema = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
            description: 'Müsaitlik kaydı ID'
        },
        staffId: {
            type: 'string',
            format: 'uuid',
            description: 'Personel ID'
        },
        date: {
            type: 'string',
            format: 'date',
            description: 'Müsaitlik tarihi (YYYY-MM-DD)'
        },
        dayOfWeek: {
            type: 'integer',
            minimum: 1,
            maximum: 7,
            description: 'Haftanın günü (1=Pazartesi, 7=Pazar)'
        },
        startTime: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            description: 'Çalışma başlangıç saati (HH:MM)'
        },
        endTime: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            description: 'Çalışma bitiş saati (HH:MM)'
        },
        lunchBreakStart: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            nullable: true,
            description: 'Öğle molası başlangıç saati (HH:MM)'
        },
        lunchBreakEnd: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            nullable: true,
            description: 'Öğle molası bitiş saati (HH:MM)'
        },
        isAvailable: {
            type: 'boolean',
            description: 'Personel bu tarihte müsait mi?'
        },
        type: {
            type: 'string',
            enum: ['default', 'custom', 'off'],
            description: 'Müsaitlik tipi (default: varsayılan iş saatleri, custom: özel saatler, off: izinli)'
        },
        notes: {
            type: 'string',
            nullable: true,
            description: 'Özel notlar'
        },
        staff: {
            $ref: '#/components/schemas/StaffBasic'
        },
        createdAt: {
            type: 'string',
            format: 'date-time'
        },
        updatedAt: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['staffId', 'date', 'dayOfWeek', 'startTime', 'endTime', 'isAvailable', 'type']
};
exports.CreateAvailabilitySchema = {
    type: 'object',
    properties: {
        staffId: {
            type: 'string',
            format: 'uuid',
            description: 'Personel ID'
        },
        date: {
            type: 'string',
            format: 'date',
            description: 'Müsaitlik tarihi (YYYY-MM-DD)'
        },
        startTime: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            description: 'Çalışma başlangıç saati (HH:MM)'
        },
        endTime: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            description: 'Çalışma bitiş saati (HH:MM)'
        },
        lunchBreakStart: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            nullable: true,
            description: 'Öğle molası başlangıç saati (HH:MM)'
        },
        lunchBreakEnd: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            nullable: true,
            description: 'Öğle molası bitiş saati (HH:MM)'
        },
        type: {
            type: 'string',
            enum: ['default', 'custom', 'off'],
            default: 'default',
            description: 'Müsaitlik tipi'
        },
        notes: {
            type: 'string',
            maxLength: 500,
            description: 'Özel notlar'
        }
    },
    required: ['staffId', 'date', 'startTime', 'endTime']
};
exports.UpdateAvailabilitySchema = {
    type: 'object',
    properties: {
        startTime: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            description: 'Çalışma başlangıç saati (HH:MM)'
        },
        endTime: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            description: 'Çalışma bitiş saati (HH:MM)'
        },
        lunchBreakStart: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            nullable: true,
            description: 'Öğle molası başlangıç saati (HH:MM)'
        },
        lunchBreakEnd: {
            type: 'string',
            pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
            nullable: true,
            description: 'Öğle molası bitiş saati (HH:MM)'
        },
        isAvailable: {
            type: 'boolean',
            description: 'Personel bu tarihte müsait mi?'
        },
        type: {
            type: 'string',
            enum: ['default', 'custom', 'off'],
            description: 'Müsaitlik tipi'
        },
        notes: {
            type: 'string',
            maxLength: 500,
            description: 'Özel notlar'
        }
    },
    minProperties: 1
};
exports.BulkCreateAvailabilitySchema = {
    type: 'object',
    properties: {
        staffId: {
            type: 'string',
            format: 'uuid',
            description: 'Personel ID'
        },
        dateRange: {
            type: 'object',
            properties: {
                startDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Başlangıç tarihi'
                },
                endDate: {
                    type: 'string',
                    format: 'date',
                    description: 'Bitiş tarihi'
                }
            },
            required: ['startDate', 'endDate']
        },
        workingDays: {
            type: 'array',
            items: {
                type: 'integer',
                minimum: 1,
                maximum: 7
            },
            minItems: 1,
            description: 'Çalışma günleri (1=Pazartesi, 7=Pazar)'
        },
        schedule: {
            type: 'object',
            properties: {
                startTime: {
                    type: 'string',
                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                    description: 'Çalışma başlangıç saati (HH:MM)'
                },
                endTime: {
                    type: 'string',
                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                    description: 'Çalışma bitiş saati (HH:MM)'
                },
                lunchBreakStart: {
                    type: 'string',
                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                    nullable: true,
                    description: 'Öğle molası başlangıç saati (HH:MM)'
                },
                lunchBreakEnd: {
                    type: 'string',
                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                    nullable: true,
                    description: 'Öğle molası bitiş saati (HH:MM)'
                }
            },
            required: ['startTime', 'endTime']
        }
    },
    required: ['staffId', 'dateRange', 'workingDays', 'schedule']
};
exports.StaffAvailabilityWithAppointmentsSchema = {
    type: 'object',
    properties: {
        staff: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    format: 'uuid'
                },
                fullName: {
                    type: 'string'
                },
                avatar: {
                    type: 'string',
                    nullable: true
                },
                specialties: {
                    type: 'string',
                    nullable: true
                }
            }
        },
        availability: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    date: {
                        type: 'string',
                        format: 'date'
                    },
                    dayOfWeek: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 7
                    },
                    isAvailable: {
                        type: 'boolean'
                    },
                    type: {
                        type: 'string',
                        enum: ['default', 'custom', 'off']
                    },
                    workingHours: {
                        type: 'object',
                        nullable: true,
                        properties: {
                            start: {
                                type: 'string'
                            },
                            end: {
                                type: 'string'
                            },
                            lunchBreak: {
                                type: 'object',
                                nullable: true,
                                properties: {
                                    start: {
                                        type: 'string'
                                    },
                                    end: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    },
                    appointments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                startTime: {
                                    type: 'string'
                                },
                                endTime: {
                                    type: 'string'
                                }
                            }
                        }
                    },
                    notes: {
                        type: 'string',
                        nullable: true
                    }
                }
            }
        }
    }
};
exports.AllStaffAvailabilityResponseSchema = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true
        },
        message: {
            type: 'string',
            example: 'Tüm personel müsaitlik durumları başarıyla getirildi'
        },
        data: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/StaffAvailabilityWithAppointments'
            }
        }
    }
};
//# sourceMappingURL=availability.js.map