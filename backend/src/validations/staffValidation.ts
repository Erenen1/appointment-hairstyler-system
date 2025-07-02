import Joi from 'joi';

/**
 * Personel listesi sorgu parametreleri validation
 */
export const staffListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  isActive: Joi.boolean().optional(),
  sortBy: Joi.string().valid('firstName', 'lastName', 'createdAt').default('firstName'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc')
});

/**
 * Personel ID parametresi validation
 */
export const staffIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

/**
 * Yeni personel oluşturma validation
 */
export const createStaffSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Ad alanı boş olamaz',
      'string.min': 'Ad en az 2 karakter olmalıdır',
      'string.max': 'Ad en fazla 50 karakter olabilir',
      'any.required': 'Ad alanı zorunludur'
    }),
  
  lastName: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Soyad alanı boş olamaz',
      'string.min': 'Soyad en az 2 karakter olmalıdır',
      'string.max': 'Soyad en fazla 50 karakter olabilir',
      'any.required': 'Soyad alanı zorunludur'
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
  
  specialization: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Uzmanlık alanı boş olamaz',
      'string.min': 'Uzmanlık alanı en az 2 karakter olmalıdır',
      'string.max': 'Uzmanlık alanı en fazla 100 karakter olabilir',
      'any.required': 'Uzmanlık alanı zorunludur'
    }),
  
  bio: Joi.string().trim().max(1000).allow('').optional()
    .messages({
      'string.max': 'Biyografi en fazla 1000 karakter olabilir'
    }),
  
  profileImage: Joi.string().uri().allow('').optional()
    .messages({
      'string.uri': 'Geçerli bir URL giriniz'
    }),
  
  serviceIds: Joi.array().items(Joi.number().integer().positive()).optional()
    .messages({
      'array.base': 'Hizmet ID\'leri bir dizi olmalıdır',
      'number.positive': 'Hizmet ID\'leri pozitif sayı olmalıdır'
    })
});

/**
 * Personel güncelleme validation
 */
export const updateStaffSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional()
    .messages({
      'string.empty': 'Ad alanı boş olamaz',
      'string.min': 'Ad en az 2 karakter olmalıdır',
      'string.max': 'Ad en fazla 50 karakter olabilir'
    }),
  
  lastName: Joi.string().trim().min(2).max(50).optional()
    .messages({
      'string.empty': 'Soyad alanı boş olamaz',
      'string.min': 'Soyad en az 2 karakter olmalıdır',
      'string.max': 'Soyad en fazla 50 karakter olabilir'
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
  
  specialization: Joi.string().trim().min(2).max(100).optional()
    .messages({
      'string.empty': 'Uzmanlık alanı boş olamaz',
      'string.min': 'Uzmanlık alanı en az 2 karakter olmalıdır',
      'string.max': 'Uzmanlık alanı en fazla 100 karakter olabilir'
    }),
  
  bio: Joi.string().trim().max(1000).allow('').optional()
    .messages({
      'string.max': 'Biyografi en fazla 1000 karakter olabilir'
    }),
  
  profileImage: Joi.string().uri().allow('').optional()
    .messages({
      'string.uri': 'Geçerli bir URL giriniz'
    }),
  
  isActive: Joi.boolean().optional(),
  
  serviceIds: Joi.array().items(Joi.number().integer().positive()).optional()
    .messages({
      'array.base': 'Hizmet ID\'leri bir dizi olmalıdır',
      'number.positive': 'Hizmet ID\'leri pozitif sayı olmalıdır'
    })
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir'
});

/**
 * Müsait saatler sorgu parametreleri validation
 */
export const availableSlotsQuerySchema = Joi.object({
  date: Joi.date().min('now').required()
    .messages({
      'date.base': 'Geçerli bir tarih giriniz',
      'date.min': 'Geçmiş tarih seçilemez',
      'any.required': 'Tarih alanı zorunludur'
    }),
  
  serviceId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Hizmet ID sayı olmalıdır',
      'number.positive': 'Hizmet ID pozitif sayı olmalıdır',
      'any.required': 'Hizmet ID zorunludur'
    })
}); 