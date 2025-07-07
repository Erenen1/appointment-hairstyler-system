"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRangeQuerySchema = exports.bulkCreateAvailabilitySchema = exports.availabilityIdSchema = exports.availabilityQuerySchema = exports.updateAvailabilitySchema = exports.createAvailabilitySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAvailabilitySchema = joi_1.default.object({
    staffId: joi_1.default.string().uuid().required().messages({
        'string.guid': 'Geçerli bir personel ID giriniz',
        'any.required': 'Personel seçimi gereklidir'
    }),
    date: joi_1.default.date().min('now').required().messages({
        'date.base': 'Geçerli bir tarih giriniz',
        'date.min': 'Geçmiş tarih seçilemez',
        'any.required': 'Tarih gereklidir'
    }),
    startTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
        'string.pattern.base': 'Geçerli saat formatı: HH:MM',
        'any.required': 'Başlangıç saati gereklidir'
    }),
    endTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
        'string.pattern.base': 'Geçerli saat formatı: HH:MM',
        'any.required': 'Bitiş saati gereklidir'
    }),
    lunchBreakStart: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
    lunchBreakEnd: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
    type: joi_1.default.string().valid('default', 'custom', 'off').optional().default('default'),
    notes: joi_1.default.string().max(500).optional().allow('')
});
exports.updateAvailabilitySchema = joi_1.default.object({
    startTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    lunchBreakStart: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
    lunchBreakEnd: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
    isAvailable: joi_1.default.boolean().optional(),
    type: joi_1.default.string().valid('default', 'custom', 'off').optional(),
    notes: joi_1.default.string().max(500).optional().allow('')
}).min(1).messages({
    'object.min': 'En az bir alan güncellenmelidir'
});
exports.availabilityQuerySchema = joi_1.default.object({
    staffId: joi_1.default.string().uuid().optional(),
    date: joi_1.default.date().optional(),
    startDate: joi_1.default.date().optional(),
    endDate: joi_1.default.date().optional(),
    type: joi_1.default.string().valid('default', 'custom', 'off').optional(),
    isAvailable: joi_1.default.boolean().optional()
});
exports.availabilityIdSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required().messages({
        'number.base': 'Müsaitlik ID sayısal değer olmalıdır',
        'number.integer': 'Müsaitlik ID tam sayı olmalıdır',
        'number.positive': 'Müsaitlik ID 0\'dan büyük olmalıdır',
        'any.required': 'Müsaitlik ID gereklidir'
    })
});
exports.bulkCreateAvailabilitySchema = joi_1.default.object({
    staffId: joi_1.default.string().uuid().required(),
    dateRange: joi_1.default.object({
        startDate: joi_1.default.date().required(),
        endDate: joi_1.default.date().required()
    }).required(),
    workingDays: joi_1.default.array().items(joi_1.default.number().integer().min(1).max(7)).min(1).required().messages({
        'array.min': 'En az bir çalışma günü seçilmelidir'
    }),
    schedule: joi_1.default.object({
        startTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        endTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        lunchBreakStart: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
        lunchBreakEnd: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null)
    }).required()
});
exports.dateRangeQuerySchema = joi_1.default.object({
    startDate: joi_1.default.date().required().messages({
        'date.base': 'Geçerli başlangıç tarihi giriniz',
        'any.required': 'Başlangıç tarihi gereklidir'
    }),
    endDate: joi_1.default.date().required().messages({
        'date.base': 'Geçerli bitiş tarihi giriniz',
        'any.required': 'Bitiş tarihi gereklidir'
    }),
    serviceId: joi_1.default.number().integer().positive().optional().messages({
        'number.base': 'Hizmet ID sayısal değer olmalıdır'
    })
});
//# sourceMappingURL=availabilityValidation.js.map