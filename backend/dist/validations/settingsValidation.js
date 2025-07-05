"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsIdSchema = exports.updateSmsTemplateSchema = exports.updateEmailTemplateSchema = exports.updateAdminNotificationSchema = exports.updateSiteSettingsSchema = exports.createSpecialDaySchema = exports.updateBusinessHoursSchema = exports.updateBusinessInfoSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateBusinessInfoSchema = joi_1.default.object({
    businessName: joi_1.default.string().trim().min(2).max(255).optional()
        .messages({
        'string.empty': 'İşletme adı boş olamaz',
        'string.min': 'İşletme adı en az 2 karakter olmalıdır',
        'string.max': 'İşletme adı en fazla 255 karakter olabilir'
    }),
    description: joi_1.default.string().max(1000).allow('').optional()
        .messages({
        'string.max': 'Açıklama en fazla 1000 karakter olabilir'
    }),
    address: joi_1.default.string().max(500).allow('').optional()
        .messages({
        'string.max': 'Adres en fazla 500 karakter olabilir'
    }),
    phone: joi_1.default.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).optional()
        .messages({
        'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
        'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
        'string.max': 'Telefon numarası en fazla 20 karakter olabilir'
    }),
    email: joi_1.default.string().email().trim().lowercase().optional()
        .messages({
        'string.email': 'Geçerli bir email adresi giriniz'
    }),
    website: joi_1.default.string().uri().allow('').optional()
        .messages({
        'string.uri': 'Geçerli bir website URL\'si giriniz'
    }),
    logo: joi_1.default.string().uri().allow('').optional()
        .messages({
        'string.uri': 'Geçerli bir logo URL\'si giriniz'
    }),
    socialMedia: joi_1.default.object({
        facebook: joi_1.default.string().uri().allow('').optional(),
        instagram: joi_1.default.string().uri().allow('').optional(),
        twitter: joi_1.default.string().uri().allow('').optional(),
        youtube: joi_1.default.string().uri().allow('').optional(),
        linkedin: joi_1.default.string().uri().allow('').optional()
    }).optional()
}).min(1).messages({
    'object.min': 'En az bir alan güncellenmelidir'
});
exports.updateBusinessHoursSchema = joi_1.default.object({
    monday: joi_1.default.object({
        isOpen: joi_1.default.boolean().required(),
        openTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() }),
        closeTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() })
    }).optional(),
    tuesday: joi_1.default.object({
        isOpen: joi_1.default.boolean().required(),
        openTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() }),
        closeTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() })
    }).optional(),
    wednesday: joi_1.default.object({
        isOpen: joi_1.default.boolean().required(),
        openTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() }),
        closeTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() })
    }).optional(),
    thursday: joi_1.default.object({
        isOpen: joi_1.default.boolean().required(),
        openTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() }),
        closeTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() })
    }).optional(),
    friday: joi_1.default.object({
        isOpen: joi_1.default.boolean().required(),
        openTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() }),
        closeTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() })
    }).optional(),
    saturday: joi_1.default.object({
        isOpen: joi_1.default.boolean().required(),
        openTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() }),
        closeTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() })
    }).optional(),
    sunday: joi_1.default.object({
        isOpen: joi_1.default.boolean().required(),
        openTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() }),
        closeTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: joi_1.default.required() })
    }).optional()
}).min(1).messages({
    'object.min': 'En az bir gün güncellenmelidir',
    'string.pattern.base': 'Saat formatı HH:MM şeklinde olmalıdır (örn: 09:00)'
});
exports.createSpecialDaySchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(255).required()
        .messages({
        'string.empty': 'Tatil adı boş olamaz',
        'string.min': 'Tatil adı en az 2 karakter olmalıdır',
        'string.max': 'Tatil adı en fazla 255 karakter olabilir',
        'any.required': 'Tatil adı zorunludur'
    }),
    date: joi_1.default.date().min('now').required()
        .messages({
        'date.base': 'Geçerli bir tarih giriniz',
        'date.min': 'Geçmiş tarih seçilemez',
        'any.required': 'Tarih zorunludur'
    }),
    description: joi_1.default.string().max(500).allow('').optional()
        .messages({
        'string.max': 'Açıklama en fazla 500 karakter olabilir'
    }),
    isRecurring: joi_1.default.boolean().default(false),
    type: joi_1.default.string().valid('holiday', 'closed', 'special_hours').default('holiday')
        .messages({
        'any.only': 'Tip holiday, closed veya special_hours olmalıdır'
    }),
    specialHours: joi_1.default.object({
        openTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        closeTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    }).when('type', { is: 'special_hours', then: joi_1.default.required() }).optional()
});
exports.updateSiteSettingsSchema = joi_1.default.object({
    siteName: joi_1.default.string().trim().min(2).max(255).optional(),
    siteDescription: joi_1.default.string().max(500).allow('').optional(),
    siteKeywords: joi_1.default.string().max(255).allow('').optional(),
    favicon: joi_1.default.string().uri().allow('').optional(),
    metaTitle: joi_1.default.string().max(60).allow('').optional(),
    metaDescription: joi_1.default.string().max(160).allow('').optional(),
    appointmentSettings: joi_1.default.object({
        minAdvanceBooking: joi_1.default.number().integer().min(1).max(7).optional(),
        maxAdvanceBooking: joi_1.default.number().integer().min(7).max(365).optional(),
        slotDuration: joi_1.default.number().integer().valid(15, 30, 45, 60).optional(),
        bufferTime: joi_1.default.number().integer().min(0).max(60).optional(),
        allowCancellation: joi_1.default.boolean().optional(),
        cancellationDeadline: joi_1.default.number().integer().min(1).max(48).optional(),
        requireConfirmation: joi_1.default.boolean().optional(),
        sendReminders: joi_1.default.boolean().optional(),
        reminderTime: joi_1.default.number().integer().valid(24, 12, 2, 1).optional()
    }).optional(),
    emailSettings: joi_1.default.object({
        smtpHost: joi_1.default.string().allow('').optional(),
        smtpPort: joi_1.default.number().integer().min(1).max(65535).optional(),
        smtpUser: joi_1.default.string().email().allow('').optional(),
        smtpPassword: joi_1.default.string().allow('').optional(),
        smtpSecure: joi_1.default.boolean().optional(),
        fromName: joi_1.default.string().max(100).allow('').optional(),
        fromEmail: joi_1.default.string().email().allow('').optional()
    }).optional(),
    smsSettings: joi_1.default.object({
        provider: joi_1.default.string().valid('twilio', 'nexmo', 'local').optional(),
        apiKey: joi_1.default.string().allow('').optional(),
        apiSecret: joi_1.default.string().allow('').optional(),
        fromNumber: joi_1.default.string().allow('').optional()
    }).optional(),
    notificationSettings: joi_1.default.object({
        newAppointment: joi_1.default.boolean().optional(),
        appointmentCancelled: joi_1.default.boolean().optional(),
        appointmentRescheduled: joi_1.default.boolean().optional(),
        newCustomer: joi_1.default.boolean().optional(),
        lowStock: joi_1.default.boolean().optional(),
        dailyReport: joi_1.default.boolean().optional()
    }).optional()
}).min(1).messages({
    'object.min': 'En az bir ayar güncellenmelidir'
});
exports.updateAdminNotificationSchema = joi_1.default.object({
    emailNotifications: joi_1.default.boolean().optional(),
    smsNotifications: joi_1.default.boolean().optional(),
    pushNotifications: joi_1.default.boolean().optional(),
    notificationTypes: joi_1.default.object({
        newAppointment: joi_1.default.boolean().optional(),
        appointmentCancelled: joi_1.default.boolean().optional(),
        appointmentCompleted: joi_1.default.boolean().optional(),
        newCustomer: joi_1.default.boolean().optional(),
        newReview: joi_1.default.boolean().optional(),
        systemAlerts: joi_1.default.boolean().optional()
    }).optional(),
    quietHours: joi_1.default.object({
        enabled: joi_1.default.boolean().optional(),
        startTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
        endTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
    }).optional()
}).min(1).messages({
    'object.min': 'En az bir bildirim ayarı güncellenmelidir'
});
exports.updateEmailTemplateSchema = joi_1.default.object({
    templateType: joi_1.default.string().valid('appointment_confirmation', 'appointment_reminder', 'appointment_cancelled', 'welcome_customer', 'password_reset').required(),
    subject: joi_1.default.string().trim().min(3).max(255).required()
        .messages({
        'string.empty': 'Konu boş olamaz',
        'string.min': 'Konu en az 3 karakter olmalıdır',
        'string.max': 'Konu en fazla 255 karakter olabilir',
        'any.required': 'Konu zorunludur'
    }),
    content: joi_1.default.string().min(10).required()
        .messages({
        'string.empty': 'İçerik boş olamaz',
        'string.min': 'İçerik en az 10 karakter olmalıdır',
        'any.required': 'İçerik zorunludur'
    }),
    isActive: joi_1.default.boolean().default(true)
});
exports.updateSmsTemplateSchema = joi_1.default.object({
    templateType: joi_1.default.string().valid('appointment_confirmation', 'appointment_reminder', 'appointment_cancelled').required(),
    content: joi_1.default.string().trim().min(10).max(160).required()
        .messages({
        'string.empty': 'İçerik boş olamaz',
        'string.min': 'İçerik en az 10 karakter olmalıdır',
        'string.max': 'SMS içeriği en fazla 160 karakter olabilir',
        'any.required': 'İçerik zorunludur'
    }),
    isActive: joi_1.default.boolean().default(true)
});
exports.settingsIdSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required()
        .messages({
        'number.base': 'ID sayı olmalıdır',
        'number.positive': 'ID pozitif sayı olmalıdır',
        'any.required': 'ID zorunludur'
    })
});
//# sourceMappingURL=settingsValidation.js.map