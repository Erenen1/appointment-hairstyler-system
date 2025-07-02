import Joi from 'joi';


export const createAdminSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.empty': 'Kullanıcı adı boş olamaz',
      'string.min': 'Kullanıcı adı en az 3 karakter olmalıdır',
      'string.max': 'Kullanıcı adı en fazla 50 karakter olabilir',
      'string.pattern.base': 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir',
      'any.required': 'Kullanıcı adı gereklidir'
    }),
  password: Joi.string()
    .min(6)
    .max(255)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.empty': 'Şifre boş olamaz',
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'string.max': 'Şifre en fazla 255 karakter olabilir',
      'string.pattern.base': 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
      'any.required': 'Şifre gereklidir'
    }),
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Ad soyad boş olamaz',
      'string.min': 'Ad soyad en az 2 karakter olmalıdır',
      'string.max': 'Ad soyad en fazla 100 karakter olabilir',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.empty': 'E-posta boş olamaz',
      'string.email': 'Geçerli bir e-posta adresi girin',
      'any.required': 'E-posta gereklidir'
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Geçerli bir telefon numarası girin'
    }),
  isActive: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'Aktiflik durumu true veya false olmalıdır'
    })
});

/**
 * Admin güncelleme validation schema
 */
export const updateAdminSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .optional()
    .messages({
      'string.empty': 'Kullanıcı adı boş olamaz',
      'string.min': 'Kullanıcı adı en az 3 karakter olmalıdır',
      'string.max': 'Kullanıcı adı en fazla 50 karakter olabilir',
      'string.pattern.base': 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'
    }),
  fullName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Ad soyad boş olamaz',
      'string.min': 'Ad soyad en az 2 karakter olmalıdır',
      'string.max': 'Ad soyad en fazla 100 karakter olabilir'
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .optional()
    .messages({
      'string.empty': 'E-posta boş olamaz',
      'string.email': 'Geçerli bir e-posta adresi girin'
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .allow('', null)
    .optional()
    .messages({
      'string.pattern.base': 'Geçerli bir telefon numarası girin'
    }),
  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Aktiflik durumu true veya false olmalıdır'
    })
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir'
});

/**
 * Şifre değiştirme validation schema
 */
export const changePasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(6)
    .max(255)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.empty': 'Yeni şifre boş olamaz',
      'string.min': 'Yeni şifre en az 6 karakter olmalıdır',
      'string.max': 'Yeni şifre en fazla 255 karakter olabilir',
      'string.pattern.base': 'Yeni şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir',
      'any.required': 'Yeni şifre gereklidir'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Şifre tekrarı eşleşmiyor',
      'any.required': 'Şifre tekrarı gereklidir'
    })
});

/**
 * Admin ID parameter validation
 */
export const adminIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Admin ID sayı olmalıdır',
      'number.integer': 'Admin ID tam sayı olmalıdır',
      'number.positive': 'Admin ID pozitif sayı olmalıdır',
      'any.required': 'Admin ID gereklidir'
    })
});

/**
 * Admin listesi query validation schema
 */
export const adminListQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Sayfa numarası sayı olmalıdır',
      'number.integer': 'Sayfa numarası tam sayı olmalıdır',
      'number.min': 'Sayfa numarası en az 1 olmalıdır'
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit sayı olmalıdır',
      'number.integer': 'Limit tam sayı olmalıdır',
      'number.min': 'Limit en az 1 olmalıdır',
      'number.max': 'Limit en fazla 100 olmalıdır'
    }),
  search: Joi.string()
    .trim()
    .allow('')
    .optional()
    .messages({
      'string.base': 'Arama terimi metin olmalıdır'
    }),
  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'Aktiflik durumu true veya false olmalıdır'
    }),
  sortBy: Joi.string()
    .valid('id', 'username', 'fullName', 'email', 'createdAt', 'updatedAt', 'lastLogin')
    .default('id')
    .messages({
      'any.only': 'Geçersiz sıralama alanı'
    }),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sıralama yönü asc veya desc olmalıdır'
    })
}); 