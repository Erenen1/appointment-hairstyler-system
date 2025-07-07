"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffPerformanceReportQuerySchema = exports.popularServicesReportQuerySchema = exports.customerReportQuerySchema = exports.appointmentReportQuerySchema = exports.revenueReportQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.revenueReportQuerySchema = joi_1.default.object({
    startDate: joi_1.default.date().required()
        .messages({
        'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
        'any.required': 'Başlangıç tarihi zorunludur'
    }),
    endDate: joi_1.default.date().min(joi_1.default.ref('startDate')).required()
        .messages({
        'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
        'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
        'any.required': 'Bitiş tarihi zorunludur'
    }),
    groupBy: joi_1.default.string().valid('day', 'week', 'month').default('day')
        .messages({
        'any.only': 'Gruplama değeri day, week veya month olmalıdır'
    }),
    staffId: joi_1.default.string().uuid().optional()
        .messages({
        'string.base': 'Personel ID string olmalıdır',
        'string.guid': 'Personel ID geçerli UUID formatında olmalıdır'
    }),
    serviceId: joi_1.default.string().uuid().optional()
        .messages({
        'string.base': 'Hizmet ID string olmalıdır',
        'string.guid': 'Hizmet ID geçerli UUID formatında olmalıdır'
    })
});
exports.appointmentReportQuerySchema = joi_1.default.object({
    startDate: joi_1.default.date().required()
        .messages({
        'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
        'any.required': 'Başlangıç tarihi zorunludur'
    }),
    endDate: joi_1.default.date().min(joi_1.default.ref('startDate')).required()
        .messages({
        'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
        'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
        'any.required': 'Bitiş tarihi zorunludur'
    }),
    staffId: joi_1.default.string().uuid().optional()
        .messages({
        'string.base': 'Personel ID string olmalıdır',
        'string.guid': 'Personel ID geçerli UUID formatında olmalıdır'
    }),
    serviceId: joi_1.default.string().uuid().optional()
        .messages({
        'string.base': 'Hizmet ID string olmalıdır',
        'string.guid': 'Hizmet ID geçerli UUID formatında olmalıdır'
    }),
    status: joi_1.default.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional()
        .messages({
        'any.only': 'Durum pending, confirmed, completed veya cancelled olmalıdır'
    })
});
exports.customerReportQuerySchema = joi_1.default.object({
    startDate: joi_1.default.date().required()
        .messages({
        'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
        'any.required': 'Başlangıç tarihi zorunludur'
    }),
    endDate: joi_1.default.date().min(joi_1.default.ref('startDate')).required()
        .messages({
        'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
        'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
        'any.required': 'Bitiş tarihi zorunludur'
    }),
    groupBy: joi_1.default.string().valid('day', 'week', 'month').default('month')
        .messages({
        'any.only': 'Gruplama değeri day, week veya month olmalıdır'
    }),
    includeInactive: joi_1.default.boolean().default(false)
});
exports.popularServicesReportQuerySchema = joi_1.default.object({
    startDate: joi_1.default.date().required()
        .messages({
        'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
        'any.required': 'Başlangıç tarihi zorunludur'
    }),
    endDate: joi_1.default.date().min(joi_1.default.ref('startDate')).required()
        .messages({
        'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
        'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
        'any.required': 'Bitiş tarihi zorunludur'
    }),
    limit: joi_1.default.number().integer().min(1).max(20).default(10)
        .messages({
        'number.base': 'Limit sayı olmalıdır',
        'number.min': 'Limit en az 1 olmalıdır',
        'number.max': 'Limit en fazla 20 olabilir'
    }),
    categoryId: joi_1.default.string().uuid().optional()
        .messages({
        'string.base': 'Kategori ID string olmalıdır',
        'string.guid': 'Kategori ID geçerli UUID formatında olmalıdır'
    })
});
exports.staffPerformanceReportQuerySchema = joi_1.default.object({
    startDate: joi_1.default.date().required()
        .messages({
        'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
        'any.required': 'Başlangıç tarihi zorunludur'
    }),
    endDate: joi_1.default.date().min(joi_1.default.ref('startDate')).required()
        .messages({
        'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
        'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
        'any.required': 'Bitiş tarihi zorunludur'
    }),
    staffId: joi_1.default.string().uuid().optional()
        .messages({
        'string.base': 'Personel ID string olmalıdır',
        'string.guid': 'Personel ID geçerli UUID formatında olmalıdır'
    }),
    includeInactive: joi_1.default.boolean().default(false)
});
//# sourceMappingURL=reportValidation.js.map