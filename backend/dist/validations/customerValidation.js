"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerSchema = exports.createCustomerSchema = exports.customerIdSchema = exports.customerListQuerySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.customerListQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    search: joi_1.default.string().trim().allow('').optional(),
    sortBy: joi_1.default.string().valid('name', 'createdAt', 'lastVisit', 'totalSpent').default('createdAt'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc')
});
exports.customerIdSchema = joi_1.default.object({
    id: joi_1.default.string().uuid().required()
});
exports.createCustomerSchema = joi_1.default.object({
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
    notes: joi_1.default.string().trim().max(500).allow('').optional()
        .messages({
        'string.max': 'Notlar en fazla 500 karakter olabilir'
    })
});
exports.updateCustomerSchema = joi_1.default.object({
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
    notes: joi_1.default.string().trim().max(500).allow('').optional()
        .messages({
        'string.max': 'Notlar en fazla 500 karakter olabilir'
    })
}).min(1).messages({
    'object.min': 'En az bir alan güncellenmelidir'
});
//# sourceMappingURL=customerValidation.js.map