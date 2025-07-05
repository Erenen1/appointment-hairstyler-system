"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCreateSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .trim()
        .min(3)
        .max(255)
        .required()
        .messages({
        'string.empty': 'Email veya e-posta boş olamaz',
        'string.min': 'Email veya e-posta en az 3 karakter olmalıdır',
        'string.max': 'Email veya e-posta en fazla 255 karakter olabilir',
        'any.required': 'Email veya e-posta gereklidir'
    }),
    password: joi_1.default.string()
        .min(6)
        .required()
        .messages({
        'string.empty': 'Şifre boş olamaz',
        'string.min': 'Şifre en az 6 karakter olmalıdır',
        'any.required': 'Şifre gereklidir'
    })
});
exports.adminCreateSchema = joi_1.default.object({
    fullName: joi_1.default.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
        'string.empty': 'Ad soyad boş olamaz',
        'string.min': 'Ad soyad en az 2 karakter olmalıdır',
        'string.max': 'Ad soyad en fazla 100 karakter olabilir',
        'any.required': 'Ad soyad gereklidir'
    }),
    email: joi_1.default.string()
        .email()
        .trim()
        .lowercase()
        .required()
        .messages({
        'string.empty': 'E-posta boş olamaz',
        'string.email': 'Geçerli bir e-posta adresi girin',
        'any.required': 'E-posta gereklidir'
    }),
    password: joi_1.default.string()
        .min(6)
        .max(255)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
        'string.empty': 'Şifre boş olamaz',
        'string.min': 'Şifre en az 6 karakter olmalıdır',
        'string.max': 'Şifre en fazla 255 karakter olabilir',
        'string.pattern.base': 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
        'any.required': 'Şifre gereklidir'
    }),
    phone: joi_1.default.string()
        .pattern(/^[0-9+\-\s()]+$/)
        .allow('', null)
        .messages({
        'string.pattern.base': 'Geçerli bir telefon numarası girin'
    })
});
//# sourceMappingURL=authValidation.js.map