"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableSlotsQuerySchema = exports.updateStaffSchema = exports.createStaffSchema = exports.staffIdSchema = exports.staffListQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.staffListQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    search: joi_1.default.string().trim().allow('').optional(),
    isActive: joi_1.default.boolean().optional(),
    sortBy: joi_1.default.string().valid('firstName', 'lastName', 'createdAt').default('firstName'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('asc')
});
exports.staffIdSchema = joi_1.default.object({
    id: joi_1.default.string().uuid().required()
});
exports.createStaffSchema = joi_1.default.object({
    fullName: joi_1.default.string().trim().min(2).max(50).required()
        .messages({
        'string.empty': 'Ad alanı boş olamaz',
        'string.min': 'Ad en az 2 karakter olmalıdır',
        'string.max': 'Ad en fazla 50 karakter olabilir',
        'any.required': 'Ad alanı zorunludur'
    }),
    email: joi_1.default.string().email().trim().lowercase().required()
        .messages({
        'string.email': 'Geçerli bir email adresi giriniz',
        'string.empty': 'Email alanı boş olamaz',
        'any.required': 'Email alanı zorunludur'
    }),
    phone: joi_1.default.string().trim().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).required()
        .messages({
        'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
        'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
        'string.max': 'Telefon numarası en fazla 20 karakter olabilir',
        'string.empty': 'Telefon numarası boş olamaz',
        'any.required': 'Telefon numarası zorunludur'
    }),
    specialties: joi_1.default.string().trim().min(2).max(100).required()
        .messages({
        'string.empty': 'Uzmanlık alanı boş olamaz',
        'string.min': 'Uzmanlık alanı en az 2 karakter olmalıdır',
        'string.max': 'Uzmanlık alanı en fazla 100 karakter olabilir',
        'any.required': 'Uzmanlık alanı zorunludur'
    }),
    serviceIds: joi_1.default.array().items(joi_1.default.number().integer().positive()).min(0).optional().default([]).messages({
        'array.base': 'Hizmet listesi dizi formatında olmalıdır',
        'number.base': 'Hizmet ID sayısal değer olmalıdır',
        'number.integer': 'Hizmet ID tam sayı olmalıdır',
        'number.positive': 'Hizmet ID 0\'dan büyük olmalıdır'
    }),
    avatar: joi_1.default.string().uri().allow('').optional()
        .messages({
        'string.uri': 'Geçerli bir URL giriniz'
    }),
});
exports.updateStaffSchema = joi_1.default.object({
    fullName: joi_1.default.string().trim().min(2).max(50).optional()
        .messages({
        'string.empty': 'Ad alanı boş olamaz',
        'string.min': 'Ad en az 2 karakter olmalıdır',
        'string.max': 'Ad en fazla 50 karakter olabilir'
    }),
    email: joi_1.default.string().email().trim().lowercase().optional()
        .messages({
        'string.email': 'Geçerli bir email adresi giriniz',
        'string.empty': 'Email alanı boş olamaz'
    }),
    phone: joi_1.default.string().trim().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).optional()
        .messages({
        'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
        'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
        'string.max': 'Telefon numarası en fazla 20 karakter olabilir',
        'string.empty': 'Telefon numarası boş olamaz'
    }),
    specialties: joi_1.default.string().trim().min(2).max(100).optional()
        .messages({
        'string.empty': 'Uzmanlık alanı boş olamaz',
        'string.min': 'Uzmanlık alanı en az 2 karakter olmalıdır',
        'string.max': 'Uzmanlık alanı en fazla 100 karakter olabilir'
    }),
    serviceIds: joi_1.default.array().items(joi_1.default.number().integer().positive()).min(0).optional().messages({
        'array.base': 'Hizmet listesi dizi formatında olmalıdır',
        'number.base': 'Hizmet ID sayısal değer olmalıdır',
        'number.integer': 'Hizmet ID tam sayı olmalıdır',
        'number.positive': 'Hizmet ID 0\'dan büyük olmalıdır'
    }),
    avatar: joi_1.default.string().uri().allow('').optional()
        .messages({
        'string.uri': 'Geçerli bir URL giriniz'
    }),
    isActive: joi_1.default.boolean().optional(),
}).min(1).messages({
    'object.min': 'En az bir alan güncellenmelidir'
});
exports.availableSlotsQuerySchema = joi_1.default.object({
    date: joi_1.default.date().min('now').required()
        .messages({
        'date.base': 'Geçerli bir tarih giriniz',
        'date.min': 'Geçmiş tarih seçilemez',
        'any.required': 'Tarih alanı zorunludur'
    })
});
//# sourceMappingURL=staffValidation.js.map