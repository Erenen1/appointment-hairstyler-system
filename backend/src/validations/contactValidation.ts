import Joi from 'joi';
export const createContactMessageSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Ad alanı boş olamaz',
      'string.min': 'Ad en az 2 karakter olmalıdır',
      'string.max': 'Ad en fazla 100 karakter olabilir',
      'any.required': 'Ad alanı zorunludur'
    }),
  email: Joi.string().email().trim().lowercase().required()
    .messages({
      'string.email': 'Geçerli bir email adresi giriniz',
      'string.empty': 'Email alanı boş olamaz',
      'any.required': 'Email alanı zorunludur'
    }),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).optional()
    .messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
      'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
      'string.max': 'Telefon numarası en fazla 20 karakter olabilir'
    }),
  subject: Joi.string().trim().min(3).max(255).required()
    .messages({
      'string.empty': 'Konu alanı boş olamaz',
      'string.min': 'Konu en az 3 karakter olmalıdır',
      'string.max': 'Konu en fazla 255 karakter olabilir',
      'any.required': 'Konu alanı zorunludur'
    }),
  message: Joi.string().trim().min(10).max(2000).required()
    .messages({
      'string.empty': 'Mesaj alanı boş olamaz',
      'string.min': 'Mesaj en az 10 karakter olmalıdır',
      'string.max': 'Mesaj en fazla 2000 karakter olabilir',
      'any.required': 'Mesaj alanı zorunludur'
    }),
  category: Joi.string().valid('general', 'appointment', 'complaint', 'suggestion', 'other').default('general')
    .messages({
      'any.only': 'Kategori general, appointment, complaint, suggestion veya other olmalıdır'
    }),
  preferredContactMethod: Joi.string().valid('email', 'phone', 'both').default('email')
    .messages({
      'any.only': 'Tercih edilen iletişim yöntemi email, phone veya both olmalıdır'
    })
});
export const contactMessagesListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow('').optional(),
  category: Joi.string().valid('general', 'appointment', 'complaint', 'suggestion', 'other').optional(),
  status: Joi.string().valid('new', 'read', 'replied', 'closed').optional(),
  sortBy: Joi.string().valid('createdAt', 'name', 'subject', 'category').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional()
    .messages({
      'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır'
    })
});
export const contactMessageIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID sayı olmalıdır',
      'number.positive': 'ID pozitif sayı olmalıdır',
      'any.required': 'ID zorunludur'
    })
});
export const updateContactMessageStatusSchema = Joi.object({
  status: Joi.string().valid('new', 'read', 'replied', 'closed').required()
    .messages({
      'any.only': 'Durum new, read, replied veya closed olmalıdır',
      'any.required': 'Durum alanı zorunludur'
    }),
  adminNotes: Joi.string().max(1000).allow('').optional()
    .messages({
      'string.max': 'Admin notları en fazla 1000 karakter olabilir'
    })
});
export const replyContactMessageSchema = Joi.object({
  replyMessage: Joi.string().trim().min(10).max(2000).required()
    .messages({
      'string.empty': 'Cevap mesajı boş olamaz',
      'string.min': 'Cevap mesajı en az 10 karakter olmalıdır',
      'string.max': 'Cevap mesajı en fazla 2000 karakter olabilir',
      'any.required': 'Cevap mesajı zorunludur'
    }),
  sendEmail: Joi.boolean().default(true)
    .messages({
      'boolean.base': 'Email gönderimi boolean değer olmalıdır'
    })
}); 