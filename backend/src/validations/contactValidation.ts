import Joi from 'joi';
export const createContactMessageSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Ad soyad alanı boş bırakılamaz',
      'string.min': 'Ad soyad en az 2 karakter olmalıdır',
      'string.max': 'Ad soyad en fazla 100 karakter olabilir',
      'any.required': 'Ad soyad alanı zorunludur'
    }),
  email: Joi.string().email().trim().max(255).required()
    .messages({
      'string.empty': 'E-posta adresi boş bırakılamaz',
      'string.email': 'Geçerli bir e-posta adresi giriniz',
      'string.max': 'E-posta adresi en fazla 255 karakter olabilir',
      'any.required': 'E-posta adresi zorunludur'
    }),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).optional()
    .messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
      'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
      'string.max': 'Telefon numarası en fazla 20 karakter olabilir'
    }),
  subject: Joi.string().trim().min(2).max(200).required()
    .messages({
      'string.empty': 'Konu alanı boş bırakılamaz',
      'string.min': 'Konu en az 2 karakter olmalıdır',
      'string.max': 'Konu en fazla 200 karakter olabilir',
      'any.required': 'Konu alanı zorunludur'
    }),
  message: Joi.string().trim().min(10).max(2000).required()
    .messages({
      'string.empty': 'Mesaj alanı boş bırakılamaz',
      'string.min': 'Mesaj en az 10 karakter olmalıdır',
      'string.max': 'Mesaj en fazla 2000 karakter olabilir',
      'any.required': 'Mesaj alanı zorunludur'
    }),
  category: Joi.string().trim().valid('general', 'support', 'feedback', 'business').default('general')
    .messages({
      'any.only': 'Geçersiz kategori seçimi'
    }),
  preferredContactMethod: Joi.string().valid('email', 'phone', 'both').default('email')
    .messages({
      'any.only': 'Tercih edilen iletişim yöntemi email, phone veya both olmalıdır'
    })
});
export const contactMessagesListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'name', 'email', 'subject', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().trim().allow(''),
  category: Joi.string().trim().allow(''),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
});
export const contactMessageIdSchema = Joi.object({
    id: Joi.string().uuid().required()
      .messages({
        'string.base': 'ID string olmalıdır',
        'string.guid': 'ID geçerli UUID formatında olmalıdır',
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