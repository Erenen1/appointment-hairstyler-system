import Joi from 'joi';
export const customerListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  sortBy: Joi.string().valid('name', 'createdAt', 'lastVisit', 'totalSpent').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});
export const customerIdSchema = Joi.object({
  id: Joi.string().uuid().required()
});
export const createCustomerSchema = Joi.object({
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
  notes: Joi.string().trim().max(500).allow('').optional()
    .messages({
      'string.max': 'Notlar en fazla 500 karakter olabilir'
    })
});
export const updateCustomerSchema = Joi.object({
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
  notes: Joi.string().trim().max(500).allow('').optional()
    .messages({
      'string.max': 'Notlar en fazla 500 karakter olabilir'
    })
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir'
}); 