import Joi from 'joi';
export const revenueReportQuerySchema = Joi.object({
  startDate: Joi.date().required()
    .messages({
      'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
      'any.required': 'Başlangıç tarihi zorunludur'
    }),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
    .messages({
      'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
      'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
      'any.required': 'Bitiş tarihi zorunludur'
    }),
  groupBy: Joi.string().valid('day', 'week', 'month').default('day')
    .messages({
      'any.only': 'Gruplama değeri day, week veya month olmalıdır'
    }),
  staffId: Joi.string().uuid().optional()
    .messages({
      'string.base': 'Personel ID string olmalıdır',
      'string.guid': 'Personel ID geçerli UUID formatında olmalıdır'
    }),
  serviceId: Joi.string().uuid().optional()
    .messages({
      'string.base': 'Hizmet ID string olmalıdır',
      'string.guid': 'Hizmet ID geçerli UUID formatında olmalıdır'
    })
});
export const appointmentReportQuerySchema = Joi.object({
  startDate: Joi.date().required()
    .messages({
      'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
      'any.required': 'Başlangıç tarihi zorunludur'
    }),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
    .messages({
      'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
      'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
      'any.required': 'Bitiş tarihi zorunludur'
    }),
  staffId: Joi.string().uuid().optional()
    .messages({
      'string.base': 'Personel ID string olmalıdır',
      'string.guid': 'Personel ID geçerli UUID formatında olmalıdır'
    }),
  serviceId: Joi.string().uuid().optional()
    .messages({
      'string.base': 'Hizmet ID string olmalıdır',
      'string.guid': 'Hizmet ID geçerli UUID formatında olmalıdır'
    }),
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional()
    .messages({
      'any.only': 'Durum pending, confirmed, completed veya cancelled olmalıdır'
    })
});
export const customerReportQuerySchema = Joi.object({
  startDate: Joi.date().required()
    .messages({
      'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
      'any.required': 'Başlangıç tarihi zorunludur'
    }),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
    .messages({
      'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
      'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
      'any.required': 'Bitiş tarihi zorunludur'
    }),
  groupBy: Joi.string().valid('day', 'week', 'month').default('month')
    .messages({
      'any.only': 'Gruplama değeri day, week veya month olmalıdır'
    }),
  includeInactive: Joi.boolean().default(false)
});
export const popularServicesReportQuerySchema = Joi.object({
  startDate: Joi.date().required()
    .messages({
      'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
      'any.required': 'Başlangıç tarihi zorunludur'
    }),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
    .messages({
      'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
      'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
      'any.required': 'Bitiş tarihi zorunludur'
    }),
  limit: Joi.number().integer().min(1).max(20).default(10)
    .messages({
      'number.base': 'Limit sayı olmalıdır',
      'number.min': 'Limit en az 1 olmalıdır',
      'number.max': 'Limit en fazla 20 olabilir'
    }),
  categoryId: Joi.string().uuid().optional()
    .messages({
      'string.base': 'Kategori ID string olmalıdır',
      'string.guid': 'Kategori ID geçerli UUID formatında olmalıdır'
    })
});
export const staffPerformanceReportQuerySchema = Joi.object({
  startDate: Joi.date().required()
    .messages({
      'date.base': 'Başlangıç tarihi geçerli bir tarih olmalıdır',
      'any.required': 'Başlangıç tarihi zorunludur'
    }),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
    .messages({
      'date.base': 'Bitiş tarihi geçerli bir tarih olmalıdır',
      'date.min': 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır',
      'any.required': 'Bitiş tarihi zorunludur'
    }),
  staffId: Joi.string().uuid().optional()
    .messages({
      'string.base': 'Personel ID string olmalıdır',
      'string.guid': 'Personel ID geçerli UUID formatında olmalıdır'
    }),
  includeInactive: Joi.boolean().default(false)
}); 