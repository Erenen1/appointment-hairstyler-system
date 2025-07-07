import Joi from 'joi';
export const createAppointmentSchema = Joi.object({
  customer: Joi.object({
    fullName: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Müşteri adı boş olamaz',
      'string.min': 'Müşteri adı en az 2 karakter olmalıdır',
      'string.max': 'Müşteri adı en fazla 50 karakter olabilir',
      'any.required': 'Müşteri adı gereklidir'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'E-posta boş olamaz',
      'string.email': 'Geçerli bir e-posta adresi girin',
      'any.required': 'E-posta gereklidir'
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required().messages({
      'string.empty': 'Telefon numarası boş olamaz',
      'string.pattern.base': 'Geçerli bir telefon numarası girin',
      'any.required': 'Telefon numarası gereklidir'
    })
  }).required(),
  serviceId: Joi.string().uuid().required().messages({
    'string.base': 'Hizmet ID string değer olmalıdır',
    'string.guid': 'Hizmet ID geçerli UUID formatında olmalıdır',
    'any.required': 'Hizmet seçimi gereklidir'
  }),
  staffId: Joi.string().uuid().required().messages({
    'string.base': 'Personel ID string değer olmalıdır',
    'string.guid': 'Personel ID geçerli UUID formatında olmalıdır',
    'any.required': 'Personel seçimi gereklidir'
  }),
  appointmentDate: Joi.date().min('now').required().messages({
    'date.base': 'Geçerli bir tarih girin',
    'date.min': 'Geçmiş bir tarih seçemezsiniz',
    'any.required': 'Randevu tarihi gereklidir'
  }),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.empty': 'Başlangıç saati boş olamaz',
    'string.pattern.base': 'Geçerli bir saat formatı girin (HH:MM)',
    'any.required': 'Başlangıç saati gereklidir'
  }),
  notes: Joi.string().max(500).allow('').optional().messages({
    'string.max': 'Notlar en fazla 500 karakter olabilir'
  })
});
export const appointmentListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  staffId: Joi.string().uuid().optional(),
  customerId: Joi.string().uuid().optional(),
  serviceId: Joi.string().uuid().optional(),
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional(),
  sortBy: Joi.string().valid('appointmentDate', 'createdAt', 'customer_name', 'service_name').default('appointmentDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});
export const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').required(),
  notes: Joi.string().max(500).allow('').optional()
});
export const appointmentIdSchema = Joi.object({
  id: Joi.string().uuid().required()
});
export const calendarQuerySchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  staffId: Joi.string().uuid().optional()
}); 