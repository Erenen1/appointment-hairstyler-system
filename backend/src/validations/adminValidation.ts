import Joi from 'joi';
export const createAdminSchema = Joi.object({
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
