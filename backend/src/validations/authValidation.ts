import Joi from 'joi';
export const loginSchema = Joi.object({
  identifier: Joi.string()
    .trim()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Kullanıcı adı veya e-posta boş olamaz',
      'string.min': 'Kullanıcı adı veya e-posta en az 3 karakter olmalıdır',
      'string.max': 'Kullanıcı adı veya e-posta en fazla 255 karakter olabilir',
      'any.required': 'Kullanıcı adı veya e-posta gereklidir'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Şifre boş olamaz',
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'any.required': 'Şifre gereklidir'
    })
});
export const adminLoginSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Kullanıcı adı boş olamaz',
      'string.min': 'Kullanıcı adı en az 3 karakter olmalıdır',
      'string.max': 'Kullanıcı adı en fazla 50 karakter olabilir',
      'any.required': 'Kullanıcı adı gereklidir'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Şifre boş olamaz',
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'any.required': 'Şifre gereklidir'
    })
});
export const staffLoginSchema = Joi.object({
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
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Şifre boş olamaz',
      'string.min': 'Şifre en az 6 karakter olmalıdır',
      'any.required': 'Şifre gereklidir'
    })
});
export const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Mevcut şifre boş olamaz',
      'any.required': 'Mevcut şifre gereklidir'
    }),
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
export const adminCreateSchema = Joi.object({
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
  full_name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Ad soyad boş olamaz',
      'string.min': 'Ad soyad en az 2 karakter olmalıdır',
      'string.max': 'Ad soyad en fazla 100 karakter olabilir',
      'any.required': 'Ad soyad gereklidir'
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
    })
}); 