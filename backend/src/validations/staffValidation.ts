import Joi from 'joi';
export const staffListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('firstName', 'lastName', 'createdAt').default('firstName'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
});
export const staffIdSchema = Joi.object({
  id: Joi.string().uuid().required()
});
export const createStaffSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Ad alanı boş olamaz',
      'string.min': 'Ad en az 2 karakter olmalıdır',
      'string.max': 'Ad en fazla 50 karakter olabilir',
      'any.required': 'Ad alanı zorunludur'
    }),
  email: Joi.string().email().trim().lowercase().required()
    .messages({
      'string.email': 'Geçerli bir email adresi giriniz',
      'string.empty': 'Email alanı boş olamaz',
      'any.required': 'Email alanı zorunludur'
    }),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).required()
    .messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
      'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
      'string.max': 'Telefon numarası en fazla 20 karakter olabilir',
      'string.empty': 'Telefon numarası boş olamaz',
      'any.required': 'Telefon numarası zorunludur'
    }),
  specialties: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Uzmanlık alanı boş olamaz',
      'string.min': 'Uzmanlık alanı en az 2 karakter olmalıdır',
      'string.max': 'Uzmanlık alanı en fazla 100 karakter olabilir',
      'any.required': 'Uzmanlık alanı zorunludur'
    }),
  avatar: Joi.string().uri().allow('').optional()
    .messages({
      'string.uri': 'Geçerli bir URL giriniz'
    }),
});
export const updateStaffSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).optional()
    .messages({
      'string.empty': 'Ad alanı boş olamaz',
      'string.min': 'Ad en az 2 karakter olmalıdır',
      'string.max': 'Ad en fazla 50 karakter olabilir'
    }),
  email: Joi.string().email().trim().lowercase().optional()
    .messages({
      'string.email': 'Geçerli bir email adresi giriniz',
      'string.empty': 'Email alanı boş olamaz'
    }),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).optional()
    .messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
      'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
      'string.max': 'Telefon numarası en fazla 20 karakter olabilir',
      'string.empty': 'Telefon numarası boş olamaz'
    }),
  specialties: Joi.string().trim().min(2).max(100).optional()
    .messages({
      'string.empty': 'Uzmanlık alanı boş olamaz',
      'string.min': 'Uzmanlık alanı en az 2 karakter olmalıdır',
      'string.max': 'Uzmanlık alanı en fazla 100 karakter olabilir'
    }),
  avatar: Joi.string().uri().allow('').optional()
    .messages({
      'string.uri': 'Geçerli bir URL giriniz'
    }),
  isActive: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir'
});
export const availableSlotsQuerySchema = Joi.object({
  date: Joi.date().min('now').required()
    .messages({
      'date.base': 'Geçerli bir tarih giriniz',
      'date.min': 'Geçmiş tarih seçilemez',
      'any.required': 'Tarih alanı zorunludur'
    })
}); 