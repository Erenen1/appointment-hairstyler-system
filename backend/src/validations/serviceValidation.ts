import Joi from 'joi';
export const createServiceSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Hizmet başlığı boş olamaz',
    'string.min': 'Hizmet başlığı en az 2 karakter olmalıdır',
    'string.max': 'Hizmet başlığı en fazla 255 karakter olabilir',
    'any.required': 'Hizmet başlığı gereklidir'
  }),
  description: Joi.string().max(1000).allow('').optional().messages({
    'string.max': 'Açıklama en fazla 1000 karakter olabilir'
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Fiyat sayısal değer olmalıdır',
    'number.positive': 'Fiyat 0\'dan büyük olmalıdır',
    'any.required': 'Fiyat gereklidir'
  }),
  duration: Joi.number().integer().min(15).max(480).required().messages({
    'number.base': 'Süre sayısal değer olmalıdır',
    'number.integer': 'Süre tam sayı olmalıdır',
    'number.min': 'Süre en az 15 dakika olmalıdır',
    'number.max': 'Süre en fazla 8 saat (480 dakika) olabilir',
    'any.required': 'Süre gereklidir'
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    'number.base': 'Kategori ID sayısal değer olmalıdır',
    'number.integer': 'Kategori ID tam sayı olmalıdır',
    'number.positive': 'Kategori ID 0\'dan büyük olmalıdır',
    'any.required': 'Kategori seçimi gereklidir'
  }),
  isPopular: Joi.boolean().optional().default(false),
  isActive: Joi.boolean().optional().default(true),
  images: Joi.array().items(Joi.string().uri()).optional().default([])
});
export const updateServiceSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(1000).allow('').optional(),
  price: Joi.number().positive().precision(2).optional(),
  duration: Joi.number().integer().min(15).max(480).optional(),
  categoryId: Joi.number().integer().positive().optional(),
  isPopular: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  images: Joi.array().items(Joi.string().uri()).optional()
});
export const createServiceCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Kategori adı boş olamaz',
    'string.min': 'Kategori adı en az 2 karakter olmalıdır',
    'string.max': 'Kategori adı en fazla 100 karakter olabilir',
    'any.required': 'Kategori adı gereklidir'
  }),
  description: Joi.string().max(500).allow('').optional(),
  icon: Joi.string().max(50).optional().default('service'),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional().default('#6366f1').messages({
    'string.pattern.base': 'Renk hex formatında olmalıdır (örn: #6366f1)'
  }),
  isActive: Joi.boolean().optional().default(true)
});
export const updateServiceCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().max(500).allow('').optional(),
  icon: Joi.string().max(50).optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  isActive: Joi.boolean().optional()
});
export const serviceListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(20),
  search: Joi.string().max(255).optional(),
  categoryId: Joi.number().integer().positive().optional(),
  isActive: Joi.boolean().optional(),
  isPopular: Joi.boolean().optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  minDuration: Joi.number().integer().positive().optional(),
  maxDuration: Joi.number().integer().positive().optional(),
  sortBy: Joi.string().valid('name', 'price', 'duration', 'createdAt', 'popularity').optional().default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').optional().default('asc')
});
export const categoryListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(20),
  search: Joi.string().max(255).optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('name', 'createdAt').optional().default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').optional().default('asc')
});
export const serviceIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'Hizmet ID sayısal değer olmalıdır',
    'number.integer': 'Hizmet ID tam sayı olmalıdır',
    'number.positive': 'Hizmet ID 0\'dan büyük olmalıdır',
    'any.required': 'Hizmet ID gereklidir'
  })
});
export const categoryIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'Kategori ID sayısal değer olmalıdır',
    'number.integer': 'Kategori ID tam sayı olmalıdır',
    'number.positive': 'Kategori ID 0\'dan büyük olmalıdır',
    'any.required': 'Kategori ID gereklidir'
  })
}); 
const beforeAfterImageSchema = Joi.object({
  before: Joi.string().uri().required(),
  after: Joi.string().uri().required(),
  caption: Joi.string().required()
});
const faqSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required()
});
export const serviceSchema = Joi.object({
   categoryId: Joi.number().integer().required(),
  slug: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  duration: Joi.number().required(),
  price: Joi.number().required(),
  isActive: Joi.boolean().default(true),
  isPopular: Joi.boolean().default(false),
});
export const validateService = (data: any) => {
  const result = serviceSchema.validate(data, { abortEarly: false });
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
export const serviceQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string(),
  categoryId: Joi.number().integer(),
  isActive: Joi.boolean(),
  isPopular: Joi.boolean(),
  minPrice: Joi.number(),
  maxPrice: Joi.number(),
  sortBy: Joi.string().valid('orderIndex', 'name', 'price', 'duration', 'createdAt').default('orderIndex'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
}); 