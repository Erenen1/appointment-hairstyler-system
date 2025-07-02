import Joi from 'joi';
export const createGalleryImageSchema = Joi.object({
  imageUrl: Joi.string().uri().required()
    .messages({
      'string.uri': 'Geçerli bir resim URL\'si giriniz',
      'string.empty': 'Resim URL\'si boş olamaz',
      'any.required': 'Resim URL\'si zorunludur'
    }),
  title: Joi.string().trim().max(255).allow('').optional()
    .messages({
      'string.max': 'Başlık en fazla 255 karakter olabilir'
    }),
  description: Joi.string().max(1000).allow('').optional()
    .messages({
      'string.max': 'Açıklama en fazla 1000 karakter olabilir'
    }),
  categoryId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Kategori ID sayı olmalıdır',
      'number.positive': 'Kategori ID pozitif sayı olmalıdır',
      'any.required': 'Kategori seçimi zorunludur'
    }),
  tags: Joi.array().items(Joi.string().trim().min(2).max(50)).max(10).optional(),
  isActive: Joi.boolean().default(true)
});
export const createBannerSchema = Joi.object({
  title: Joi.string().trim().max(255).required()
    .messages({
      'string.empty': 'Başlık boş olamaz',
      'string.max': 'Başlık en fazla 255 karakter olabilir',
      'any.required': 'Başlık zorunludur'
    }),
  subtitle: Joi.string().max(500).allow('').optional()
    .messages({
      'string.max': 'Alt başlık en fazla 500 karakter olabilir'
    }),
  imageUrl: Joi.string().uri().required()
    .messages({
      'string.uri': 'Geçerli bir resim URL\'si giriniz',
      'string.empty': 'Resim URL\'si boş olamaz',
      'any.required': 'Resim URL\'si zorunludur'
    }),
  linkUrl: Joi.string().uri().allow('').optional()
    .messages({
      'string.uri': 'Geçerli bir URL giriniz'
    }),
  buttonText: Joi.string().max(50).allow('').optional()
    .messages({
      'string.max': 'Buton metni en fazla 50 karakter olabilir'
    }),
  position: Joi.string().valid('hero', 'sidebar', 'footer').default('hero')
    .messages({
      'any.only': 'Pozisyon hero, sidebar veya footer olmalıdır'
    }),
  sortOrder: Joi.number().integer().min(0).default(0)
    .messages({
      'number.base': 'Sıralama sayı olmalıdır',
      'number.min': 'Sıralama 0 veya pozitif sayı olmalıdır'
    }),
  isActive: Joi.boolean().default(true)
});
export const contentListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  categoryId: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('title', 'createdAt', 'updatedAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});
export const contentIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID sayı olmalıdır',
      'number.positive': 'ID pozitif sayı olmalıdır',
      'any.required': 'ID zorunludur'
    })
}); 