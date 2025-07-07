import Joi from 'joi';

export const createAvailabilitySchema = Joi.object({
  staffId: Joi.string().uuid().required().messages({
    'string.guid': 'Geçerli bir personel ID giriniz',
    'any.required': 'Personel seçimi gereklidir'
  }),
  date: Joi.date().min('now').required().messages({
    'date.base': 'Geçerli bir tarih giriniz',
    'date.min': 'Geçmiş tarih seçilemez',
    'any.required': 'Tarih gereklidir'
  }),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': 'Geçerli saat formatı: HH:MM',
    'any.required': 'Başlangıç saati gereklidir'
  }),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': 'Geçerli saat formatı: HH:MM',
    'any.required': 'Bitiş saati gereklidir'
  }),
  lunchBreakStart: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
  lunchBreakEnd: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
  type: Joi.string().valid('default', 'custom', 'off').optional().default('default'),
  notes: Joi.string().max(500).optional().allow('')
});

export const updateAvailabilitySchema = Joi.object({
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  lunchBreakStart: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
  lunchBreakEnd: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
  isAvailable: Joi.boolean().optional(),
  type: Joi.string().valid('default', 'custom', 'off').optional(),
  notes: Joi.string().max(500).optional().allow('')
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir'
});

export const availabilityQuerySchema = Joi.object({
  staffId: Joi.string().uuid().optional(),
  date: Joi.date().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  type: Joi.string().valid('default', 'custom', 'off').optional(),
  isAvailable: Joi.boolean().optional()
});

export const availabilityIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'Müsaitlik ID sayısal değer olmalıdır',
    'number.integer': 'Müsaitlik ID tam sayı olmalıdır',
    'number.positive': 'Müsaitlik ID 0\'dan büyük olmalıdır',
    'any.required': 'Müsaitlik ID gereklidir'
  })
});

export const bulkCreateAvailabilitySchema = Joi.object({
  staffId: Joi.string().uuid().required(),
  dateRange: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
  }).required(),
  workingDays: Joi.array().items(Joi.number().integer().min(1).max(7)).min(1).required().messages({
    'array.min': 'En az bir çalışma günü seçilmelidir'
  }),
  schedule: Joi.object({
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    lunchBreakStart: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null),
    lunchBreakEnd: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow(null)
  }).required()
});

export const dateRangeQuerySchema = Joi.object({
  startDate: Joi.date().required().messages({
    'date.base': 'Geçerli başlangıç tarihi giriniz',
    'any.required': 'Başlangıç tarihi gereklidir'
  }),
  endDate: Joi.date().required().messages({
    'date.base': 'Geçerli bitiş tarihi giriniz',
    'any.required': 'Bitiş tarihi gereklidir'
  }),
  serviceId: Joi.number().integer().positive().optional().messages({
    'number.base': 'Hizmet ID sayısal değer olmalıdır'
  })
}); 