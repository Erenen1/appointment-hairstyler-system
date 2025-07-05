"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceQuerySchema = exports.validateService = exports.serviceSchema = exports.categoryIdSchema = exports.serviceIdSchema = exports.categoryListQuerySchema = exports.serviceListQuerySchema = exports.updateServiceCategorySchema = exports.createServiceCategorySchema = exports.updateServiceSchema = exports.createServiceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createServiceSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(255).required().messages({
        'string.empty': 'Hizmet başlığı boş olamaz',
        'string.min': 'Hizmet başlığı en az 2 karakter olmalıdır',
        'string.max': 'Hizmet başlığı en fazla 255 karakter olabilir',
        'any.required': 'Hizmet başlığı gereklidir'
    }),
    description: joi_1.default.string().max(1000).allow('').optional().messages({
        'string.max': 'Açıklama en fazla 1000 karakter olabilir'
    }),
    price: joi_1.default.number().positive().precision(2).required().messages({
        'number.base': 'Fiyat sayısal değer olmalıdır',
        'number.positive': 'Fiyat 0\'dan büyük olmalıdır',
        'any.required': 'Fiyat gereklidir'
    }),
    duration: joi_1.default.number().integer().min(15).max(480).required().messages({
        'number.base': 'Süre sayısal değer olmalıdır',
        'number.integer': 'Süre tam sayı olmalıdır',
        'number.min': 'Süre en az 15 dakika olmalıdır',
        'number.max': 'Süre en fazla 8 saat (480 dakika) olabilir',
        'any.required': 'Süre gereklidir'
    }),
    categoryId: joi_1.default.number().integer().positive().required().messages({
        'number.base': 'Kategori ID sayısal değer olmalıdır',
        'number.integer': 'Kategori ID tam sayı olmalıdır',
        'number.positive': 'Kategori ID 0\'dan büyük olmalıdır',
        'any.required': 'Kategori seçimi gereklidir'
    }),
    isPopular: joi_1.default.boolean().optional().default(false),
    isActive: joi_1.default.boolean().optional().default(true),
    images: joi_1.default.array().items(joi_1.default.string().uri()).optional().default([])
});
exports.updateServiceSchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(255).optional(),
    description: joi_1.default.string().max(1000).allow('').optional(),
    price: joi_1.default.number().positive().precision(2).optional(),
    duration: joi_1.default.number().integer().min(15).max(480).optional(),
    categoryId: joi_1.default.number().integer().positive().optional(),
    isPopular: joi_1.default.boolean().optional(),
    isActive: joi_1.default.boolean().optional(),
    images: joi_1.default.array().items(joi_1.default.string().uri()).optional()
});
exports.createServiceCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required().messages({
        'string.empty': 'Kategori adı boş olamaz',
        'string.min': 'Kategori adı en az 2 karakter olmalıdır',
        'string.max': 'Kategori adı en fazla 100 karakter olabilir',
        'any.required': 'Kategori adı gereklidir'
    }),
    description: joi_1.default.string().max(500).allow('').optional(),
    icon: joi_1.default.string().max(50).optional().default('service'),
    color: joi_1.default.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().default('#6366f1').messages({
        'string.pattern.base': 'Renk hex formatında olmalıdır (örn: #6366f1)'
    }),
    isActive: joi_1.default.boolean().optional().default(true)
});
exports.updateServiceCategorySchema = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).optional(),
    description: joi_1.default.string().max(500).allow('').optional(),
    icon: joi_1.default.string().max(50).optional(),
    color: joi_1.default.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
    isActive: joi_1.default.boolean().optional()
});
exports.serviceListQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional().default(1),
    limit: joi_1.default.number().integer().min(1).max(100).optional().default(20),
    search: joi_1.default.string().max(255).optional(),
    categoryId: joi_1.default.number().integer().positive().optional(),
    isActive: joi_1.default.boolean().optional(),
    isPopular: joi_1.default.boolean().optional(),
    minPrice: joi_1.default.number().positive().optional(),
    maxPrice: joi_1.default.number().positive().optional(),
    minDuration: joi_1.default.number().integer().positive().optional(),
    maxDuration: joi_1.default.number().integer().positive().optional(),
    sortBy: joi_1.default.string().valid('name', 'price', 'duration', 'createdAt', 'popularity').optional().default('name'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').optional().default('asc')
});
exports.categoryListQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).optional().default(1),
    limit: joi_1.default.number().integer().min(1).max(100).optional().default(20),
    search: joi_1.default.string().max(255).optional(),
    isActive: joi_1.default.boolean().optional(),
    sortBy: joi_1.default.string().valid('name', 'createdAt').optional().default('name'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').optional().default('asc')
});
exports.serviceIdSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required().messages({
        'number.base': 'Hizmet ID sayısal değer olmalıdır',
        'number.integer': 'Hizmet ID tam sayı olmalıdır',
        'number.positive': 'Hizmet ID 0\'dan büyük olmalıdır',
        'any.required': 'Hizmet ID gereklidir'
    })
});
exports.categoryIdSchema = joi_1.default.object({
    id: joi_1.default.number().integer().positive().required().messages({
        'number.base': 'Kategori ID sayısal değer olmalıdır',
        'number.integer': 'Kategori ID tam sayı olmalıdır',
        'number.positive': 'Kategori ID 0\'dan büyük olmalıdır',
        'any.required': 'Kategori ID gereklidir'
    })
});
const beforeAfterImageSchema = joi_1.default.object({
    before: joi_1.default.string().uri().required(),
    after: joi_1.default.string().uri().required(),
    caption: joi_1.default.string().required()
});
const faqSchema = joi_1.default.object({
    question: joi_1.default.string().required(),
    answer: joi_1.default.string().required()
});
exports.serviceSchema = joi_1.default.object({
    categoryId: joi_1.default.number().integer().required(),
    slug: joi_1.default.string().required(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string().allow('', null),
    duration: joi_1.default.number().required(),
    price: joi_1.default.number().required(),
    isActive: joi_1.default.boolean().default(true),
    isPopular: joi_1.default.boolean().default(false),
});
const validateService = (data) => {
    const result = exports.serviceSchema.validate(data, { abortEarly: false });
    if (result.error) {
        return {
            success: false,
            errors: result.error.details.map(error => ({
                field: error.path.join('.'),
                message: error.message
            }))
        };
    }
    return {
        success: true,
        data: result.value
    };
};
exports.validateService = validateService;
exports.serviceQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    search: joi_1.default.string(),
    categoryId: joi_1.default.number().integer(),
    isActive: joi_1.default.boolean(),
    isPopular: joi_1.default.boolean(),
    minPrice: joi_1.default.number(),
    maxPrice: joi_1.default.number(),
    sortBy: joi_1.default.string().valid('orderIndex', 'name', 'price', 'duration', 'createdAt').default('orderIndex'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('asc')
});
//# sourceMappingURL=serviceValidation.js.map