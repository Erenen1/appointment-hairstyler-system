"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentIdSchema = exports.contentListQuerySchema = exports.createBannerSchema = exports.createGalleryImageSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createGalleryImageSchema = joi_1.default.object({
    imageUrl: joi_1.default.string().uri().required()
        .messages({
        'string.uri': 'Geçerli bir resim URL\'si giriniz',
        'string.empty': 'Resim URL\'si boş olamaz',
        'any.required': 'Resim URL\'si zorunludur'
    }),
    title: joi_1.default.string().trim().max(255).allow('').optional()
        .messages({
        'string.max': 'Başlık en fazla 255 karakter olabilir'
    }),
    description: joi_1.default.string().max(1000).allow('').optional()
        .messages({
        'string.max': 'Açıklama en fazla 1000 karakter olabilir'
    }),
    categoryId: joi_1.default.string().uuid().required()
        .messages({
        'string.base': 'Kategori ID string olmalıdır',
        'string.guid': 'Kategori ID geçerli UUID formatında olmalıdır',
        'any.required': 'Kategori seçimi zorunludur'
    }),
    tags: joi_1.default.array().items(joi_1.default.string().trim().min(2).max(50)).max(10).optional(),
    isActive: joi_1.default.boolean().default(true)
});
exports.createBannerSchema = joi_1.default.object({
    title: joi_1.default.string().trim().max(255).required()
        .messages({
        'string.empty': 'Başlık boş olamaz',
        'string.max': 'Başlık en fazla 255 karakter olabilir',
        'any.required': 'Başlık zorunludur'
    }),
    subtitle: joi_1.default.string().max(500).allow('').optional()
        .messages({
        'string.max': 'Alt başlık en fazla 500 karakter olabilir'
    }),
    imageUrl: joi_1.default.string().uri().required()
        .messages({
        'string.uri': 'Geçerli bir resim URL\'si giriniz',
        'string.empty': 'Resim URL\'si boş olamaz',
        'any.required': 'Resim URL\'si zorunludur'
    }),
    linkUrl: joi_1.default.string().uri().allow('').optional()
        .messages({
        'string.uri': 'Geçerli bir URL giriniz'
    }),
    buttonText: joi_1.default.string().max(50).allow('').optional()
        .messages({
        'string.max': 'Buton metni en fazla 50 karakter olabilir'
    }),
    position: joi_1.default.string().valid('hero', 'sidebar', 'footer').default('hero')
        .messages({
        'any.only': 'Pozisyon hero, sidebar veya footer olmalıdır'
    }),
    sortOrder: joi_1.default.number().integer().min(0).default(0)
        .messages({
        'number.base': 'Sıralama sayı olmalıdır',
        'number.min': 'Sıralama 0 veya pozitif sayı olmalıdır'
    }),
    isActive: joi_1.default.boolean().default(true)
});
exports.contentListQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    search: joi_1.default.string().trim().allow('').optional(),
    categoryId: joi_1.default.string().uuid().optional(),
    isActive: joi_1.default.boolean().optional(),
    sortBy: joi_1.default.string().valid('title', 'createdAt', 'updatedAt').default('createdAt'),
    sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc')
});
exports.contentIdSchema = joi_1.default.object({
    id: joi_1.default.string().uuid().required()
        .messages({
        'string.base': 'ID string olmalıdır',
        'string.guid': 'ID geçerli UUID formatında olmalıdır',
        'any.required': 'ID zorunludur'
    })
});
//# sourceMappingURL=contentValidation.js.map