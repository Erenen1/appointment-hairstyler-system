"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyContactMessageSchema = exports.updateContactMessageStatusSchema = exports.contactMessageIdSchema = exports.contactMessagesListQuerySchema = exports.createContactMessageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createContactMessageSchema = joi_1.default.object({
    fullName: joi_1.default.string().trim().min(2).max(100).required()
        .messages({
        'string.empty': 'Ad soyad alanı boş bırakılamaz',
        'string.min': 'Ad soyad en az 2 karakter olmalıdır',
        'string.max': 'Ad soyad en fazla 100 karakter olabilir',
        'any.required': 'Ad soyad alanı zorunludur'
    }),
    email: joi_1.default.string().email().trim().max(255).required()
        .messages({
        'string.empty': 'E-posta adresi boş bırakılamaz',
        'string.email': 'Geçerli bir e-posta adresi giriniz',
        'string.max': 'E-posta adresi en fazla 255 karakter olabilir',
        'any.required': 'E-posta adresi zorunludur'
    }),
    phone: joi_1.default.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).optional()
        .messages({
        'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
        'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
        'string.max': 'Telefon numarası en fazla 20 karakter olabilir'
    }),
    subject: joi_1.default.string().trim().min(2).max(200).required()
        .messages({
        'string.empty': 'Konu alanı boş bırakılamaz',
        'string.min': 'Konu en az 2 karakter olmalıdır',
        'string.max': 'Konu en fazla 200 karakter olabilir',
        'any.required': 'Konu alanı zorunludur'
    }),
    message: joi_1.default.string().trim().min(10).max(2000).required()
        .messages({
        'string.empty': 'Mesaj alanı boş bırakılamaz',
        'string.min': 'Mesaj en az 10 karakter olmalıdır',
        'string.max': 'Mesaj en fazla 2000 karakter olabilir',
        'any.required': 'Mesaj alanı zorunludur'
    }),
    category: joi_1.default.string().trim().valid('general', 'support', 'feedback', 'business').default('general')
        .messages({
        'any.only': 'Geçersiz kategori seçimi'
    }),
    preferredContactMethod: joi_1.default.string().valid('email', 'phone', 'both').default('email')
        .messages({
        'any.only': 'Tercih edilen iletişim yöntemi email, phone veya both olmalıdır'
    })
});
exports.contactMessagesListQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    sortBy: joi_1.default.string().valid('createdAt', 'name', 'email', 'subject', 'status').default('createdAt'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc'),
    search: joi_1.default.string().trim().allow(''),
    category: joi_1.default.string().trim().allow(''),
    startDate: joi_1.default.date().iso(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate'))
});
exports.contactMessageIdSchema = joi_1.default.object({
    id: joi_1.default.string().uuid().required()
        .messages({
        'string.base': 'ID string olmalıdır',
        'string.guid': 'ID geçerli UUID formatında olmalıdır',
        'any.required': 'ID zorunludur'
    })
});
exports.updateContactMessageStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('new', 'read', 'replied', 'closed').required()
        .messages({
        'any.only': 'Durum new, read, replied veya closed olmalıdır',
        'any.required': 'Durum alanı zorunludur'
    }),
    adminNotes: joi_1.default.string().max(1000).allow('').optional()
        .messages({
        'string.max': 'Admin notları en fazla 1000 karakter olabilir'
    })
});
exports.replyContactMessageSchema = joi_1.default.object({
    replyMessage: joi_1.default.string().trim().min(10).max(2000).required()
        .messages({
        'string.empty': 'Cevap mesajı boş olamaz',
        'string.min': 'Cevap mesajı en az 10 karakter olmalıdır',
        'string.max': 'Cevap mesajı en fazla 2000 karakter olabilir',
        'any.required': 'Cevap mesajı zorunludur'
    }),
    sendEmail: joi_1.default.boolean().default(true)
        .messages({
        'boolean.base': 'Email gönderimi boolean değer olmalıdır'
    })
});
//# sourceMappingURL=contactValidation.js.map