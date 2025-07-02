import Joi from 'joi';

/**
 * Gelir raporu sorgu parametreleri validation
 */
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
  
  staffId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Personel ID sayı olmalıdır',
      'number.positive': 'Personel ID pozitif sayı olmalıdır'
    }),
  
  serviceId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Hizmet ID sayı olmalıdır',
      'number.positive': 'Hizmet ID pozitif sayı olmalıdır'
    })
});

/**
 * Randevu raporu sorgu parametreleri validation
 */
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
  
  staffId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Personel ID sayı olmalıdır',
      'number.positive': 'Personel ID pozitif sayı olmalıdır'
    }),
  
  serviceId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Hizmet ID sayı olmalıdır',
      'number.positive': 'Hizmet ID pozitif sayı olmalıdır'
    }),
  
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional()
    .messages({
      'any.only': 'Durum pending, confirmed, completed veya cancelled olmalıdır'
    })
});

/**
 * Müşteri raporu sorgu parametreleri validation
 */
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

/**
 * Popüler hizmetler raporu sorgu parametreleri validation
 */
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
  
  categoryId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Kategori ID sayı olmalıdır',
      'number.positive': 'Kategori ID pozitif sayı olmalıdır'
    })
});

/**
 * Personel performans raporu sorgu parametreleri validation
 */
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
  
  staffId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Personel ID sayı olmalıdır',
      'number.positive': 'Personel ID pozitif sayı olmalıdır'
    }),
  
  includeInactive: Joi.boolean().default(false)
}); 