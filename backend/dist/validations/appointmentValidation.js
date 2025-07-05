"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendarQuerySchema = exports.appointmentIdSchema = exports.updateAppointmentStatusSchema = exports.appointmentListQuerySchema = exports.createAppointmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAppointmentSchema = joi_1.default.object({
    customer: joi_1.default.object({
        fullName: joi_1.default.string().min(2).max(50).required().messages({
            'string.empty': 'Müşteri adı boş olamaz',
            'string.min': 'Müşteri adı en az 2 karakter olmalıdır',
            'string.max': 'Müşteri adı en fazla 50 karakter olabilir',
            'any.required': 'Müşteri adı gereklidir'
        }),
        email: joi_1.default.string().email().required().messages({
            'string.empty': 'E-posta boş olamaz',
            'string.email': 'Geçerli bir e-posta adresi girin',
            'any.required': 'E-posta gereklidir'
        }),
        phone: joi_1.default.string().pattern(/^[0-9+\-\s()]+$/).required().messages({
            'string.empty': 'Telefon numarası boş olamaz',
            'string.pattern.base': 'Geçerli bir telefon numarası girin',
            'any.required': 'Telefon numarası gereklidir'
        })
    }).required(),
    serviceId: joi_1.default.number().integer().positive().required().messages({
        'number.base': 'Hizmet ID sayı olmalıdır',
        'number.integer': 'Hizmet ID tam sayı olmalıdır',
        'number.positive': 'Hizmet ID pozitif sayı olmalıdır',
        'any.required': 'Hizmet seçimi gereklidir'
    }),
    staffId: joi_1.default.number().integer().positive().required().messages({
        'number.base': 'Personel ID sayı olmalıdır',
        'number.integer': 'Personel ID tam sayı olmalıdır',
        'number.positive': 'Personel ID pozitif sayı olmalıdır',
        'any.required': 'Personel seçimi gereklidir'
    }),
    appointmentDate: joi_1.default.date().min('now').required().messages({
        'date.base': 'Geçerli bir tarih girin',
        'date.min': 'Geçmiş bir tarih seçemezsiniz',
        'any.required': 'Randevu tarihi gereklidir'
    }),
    startTime: joi_1.default.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
        'string.empty': 'Başlangıç saati boş olamaz',
        'string.pattern.base': 'Geçerli bir saat formatı girin (HH:MM)',
        'any.required': 'Başlangıç saati gereklidir'
    }),
    notes: joi_1.default.string().max(500).allow('').optional().messages({
        'string.max': 'Notlar en fazla 500 karakter olabilir'
    })
});
exports.appointmentListQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    startDate: joi_1.default.date().optional(),
    endDate: joi_1.default.date().optional(),
    staffId: joi_1.default.number().integer().positive().optional(),
    customerId: joi_1.default.number().integer().positive().optional(),
    serviceId: joi_1.default.number().integer().positive().optional(),
    status: joi_1.default.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional(),
    sortBy: joi_1.default.string().valid('appointmentDate', 'createdAt', 'customer_name', 'service_name').default('appointmentDate'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc')
});
exports.updateAppointmentStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('pending', 'confirmed', 'completed', 'cancelled').required(),
    notes: joi_1.default.string().max(500).allow('').optional()
});
exports.appointmentIdSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required()
});
exports.calendarQuerySchema = joi_1.default.object({
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
    staffId: joi_1.default.number().integer().positive().optional()
});
//# sourceMappingURL=appointmentValidation.js.map