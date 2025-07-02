import Joi from 'joi';

/**
 * İşletme bilgileri güncelleme validation
 */
export const updateBusinessInfoSchema = Joi.object({
  businessName: Joi.string().trim().min(2).max(255).optional()
    .messages({
      'string.empty': 'İşletme adı boş olamaz',
      'string.min': 'İşletme adı en az 2 karakter olmalıdır',
      'string.max': 'İşletme adı en fazla 255 karakter olabilir'
    }),
  
  description: Joi.string().max(1000).allow('').optional()
    .messages({
      'string.max': 'Açıklama en fazla 1000 karakter olabilir'
    }),
  
  address: Joi.string().max(500).allow('').optional()
    .messages({
      'string.max': 'Adres en fazla 500 karakter olabilir'
    }),
  
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).optional()
    .messages({
      'string.pattern.base': 'Geçerli bir telefon numarası giriniz',
      'string.min': 'Telefon numarası en az 10 karakter olmalıdır',
      'string.max': 'Telefon numarası en fazla 20 karakter olabilir'
    }),
  
  email: Joi.string().email().trim().lowercase().optional()
    .messages({
      'string.email': 'Geçerli bir email adresi giriniz'
    }),
  
  website: Joi.string().uri().allow('').optional()
    .messages({
      'string.uri': 'Geçerli bir website URL\'si giriniz'
    }),
  
  logo: Joi.string().uri().allow('').optional()
    .messages({
      'string.uri': 'Geçerli bir logo URL\'si giriniz'
    }),
  
  socialMedia: Joi.object({
    facebook: Joi.string().uri().allow('').optional(),
    instagram: Joi.string().uri().allow('').optional(),
    twitter: Joi.string().uri().allow('').optional(),
    youtube: Joi.string().uri().allow('').optional(),
    linkedin: Joi.string().uri().allow('').optional()
  }).optional()
}).min(1).messages({
  'object.min': 'En az bir alan güncellenmelidir'
});

/**
 * Çalışma saatleri güncelleme validation
 */
export const updateBusinessHoursSchema = Joi.object({
  monday: Joi.object({
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() }),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() })
  }).optional(),
  
  tuesday: Joi.object({
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() }),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() })
  }).optional(),
  
  wednesday: Joi.object({
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() }),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() })
  }).optional(),
  
  thursday: Joi.object({
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() }),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() })
  }).optional(),
  
  friday: Joi.object({
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() }),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() })
  }).optional(),
  
  saturday: Joi.object({
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() }),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() })
  }).optional(),
  
  sunday: Joi.object({
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() }),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).when('isOpen', { is: true, then: Joi.required() })
  }).optional()
}).min(1).messages({
  'object.min': 'En az bir gün güncellenmelidir',
  'string.pattern.base': 'Saat formatı HH:MM şeklinde olmalıdır (örn: 09:00)'
});

/**
 * Özel günler (tatil) ekleme validation
 */
export const createSpecialDaySchema = Joi.object({
  name: Joi.string().trim().min(2).max(255).required()
    .messages({
      'string.empty': 'Tatil adı boş olamaz',
      'string.min': 'Tatil adı en az 2 karakter olmalıdır',
      'string.max': 'Tatil adı en fazla 255 karakter olabilir',
      'any.required': 'Tatil adı zorunludur'
    }),
  
  date: Joi.date().min('now').required()
    .messages({
      'date.base': 'Geçerli bir tarih giriniz',
      'date.min': 'Geçmiş tarih seçilemez',
      'any.required': 'Tarih zorunludur'
    }),
  
  description: Joi.string().max(500).allow('').optional()
    .messages({
      'string.max': 'Açıklama en fazla 500 karakter olabilir'
    }),
  
  isRecurring: Joi.boolean().default(false),
  
  type: Joi.string().valid('holiday', 'closed', 'special_hours').default('holiday')
    .messages({
      'any.only': 'Tip holiday, closed veya special_hours olmalıdır'
    }),
  
  specialHours: Joi.object({
    openTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closeTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  }).when('type', { is: 'special_hours', then: Joi.required() }).optional()
});

/**
 * Site ayarları güncelleme validation
 */
export const updateSiteSettingsSchema = Joi.object({
  siteName: Joi.string().trim().min(2).max(255).optional(),
  siteDescription: Joi.string().max(500).allow('').optional(),
  siteKeywords: Joi.string().max(255).allow('').optional(),
  favicon: Joi.string().uri().allow('').optional(),
  
  // SEO ayarları
  metaTitle: Joi.string().max(60).allow('').optional(),
  metaDescription: Joi.string().max(160).allow('').optional(),
  
  // Randevu ayarları
  appointmentSettings: Joi.object({
    minAdvanceBooking: Joi.number().integer().min(1).max(7).optional(), // gün
    maxAdvanceBooking: Joi.number().integer().min(7).max(365).optional(), // gün
    slotDuration: Joi.number().integer().valid(15, 30, 45, 60).optional(), // dakika
    bufferTime: Joi.number().integer().min(0).max(60).optional(), // dakika
    allowCancellation: Joi.boolean().optional(),
    cancellationDeadline: Joi.number().integer().min(1).max(48).optional(), // saat
    requireConfirmation: Joi.boolean().optional(),
    sendReminders: Joi.boolean().optional(),
    reminderTime: Joi.number().integer().valid(24, 12, 2, 1).optional() // saat
  }).optional(),
  
  // Email ayarları
  emailSettings: Joi.object({
    smtpHost: Joi.string().allow('').optional(),
    smtpPort: Joi.number().integer().min(1).max(65535).optional(),
    smtpUser: Joi.string().email().allow('').optional(),
    smtpPassword: Joi.string().allow('').optional(),
    smtpSecure: Joi.boolean().optional(),
    fromName: Joi.string().max(100).allow('').optional(),
    fromEmail: Joi.string().email().allow('').optional()
  }).optional(),
  
  // SMS ayarları
  smsSettings: Joi.object({
    provider: Joi.string().valid('twilio', 'nexmo', 'local').optional(),
    apiKey: Joi.string().allow('').optional(),
    apiSecret: Joi.string().allow('').optional(),
    fromNumber: Joi.string().allow('').optional()
  }).optional(),
  
  // Bildirim ayarları
  notificationSettings: Joi.object({
    newAppointment: Joi.boolean().optional(),
    appointmentCancelled: Joi.boolean().optional(),
    appointmentRescheduled: Joi.boolean().optional(),
    newCustomer: Joi.boolean().optional(),
    lowStock: Joi.boolean().optional(),
    dailyReport: Joi.boolean().optional()
  }).optional()
}).min(1).messages({
  'object.min': 'En az bir ayar güncellenmelidir'
});

/**
 * Admin bildirim ayarları validation
 */
export const updateAdminNotificationSchema = Joi.object({
  emailNotifications: Joi.boolean().optional(),
  smsNotifications: Joi.boolean().optional(),
  pushNotifications: Joi.boolean().optional(),
  
  notificationTypes: Joi.object({
    newAppointment: Joi.boolean().optional(),
    appointmentCancelled: Joi.boolean().optional(),
    appointmentCompleted: Joi.boolean().optional(),
    newCustomer: Joi.boolean().optional(),
    newReview: Joi.boolean().optional(),
    systemAlerts: Joi.boolean().optional()
  }).optional(),
  
  quietHours: Joi.object({
    enabled: Joi.boolean().optional(),
    startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
  }).optional()
}).min(1).messages({
  'object.min': 'En az bir bildirim ayarı güncellenmelidir'
});

/**
 * Email şablonu güncelleme validation
 */
export const updateEmailTemplateSchema = Joi.object({
  templateType: Joi.string().valid(
    'appointment_confirmation',
    'appointment_reminder',
    'appointment_cancelled',
    'welcome_customer',
    'password_reset'
  ).required(),
  
  subject: Joi.string().trim().min(3).max(255).required()
    .messages({
      'string.empty': 'Konu boş olamaz',
      'string.min': 'Konu en az 3 karakter olmalıdır',
      'string.max': 'Konu en fazla 255 karakter olabilir',
      'any.required': 'Konu zorunludur'
    }),
  
  content: Joi.string().min(10).required()
    .messages({
      'string.empty': 'İçerik boş olamaz',
      'string.min': 'İçerik en az 10 karakter olmalıdır',
      'any.required': 'İçerik zorunludur'
    }),
  
  isActive: Joi.boolean().default(true)
});

/**
 * SMS şablonu güncelleme validation
 */
export const updateSmsTemplateSchema = Joi.object({
  templateType: Joi.string().valid(
    'appointment_confirmation',
    'appointment_reminder',
    'appointment_cancelled'
  ).required(),
  
  content: Joi.string().trim().min(10).max(160).required()
    .messages({
      'string.empty': 'İçerik boş olamaz',
      'string.min': 'İçerik en az 10 karakter olmalıdır',
      'string.max': 'SMS içeriği en fazla 160 karakter olabilir',
      'any.required': 'İçerik zorunludur'
    }),
  
  isActive: Joi.boolean().default(true)
});

/**
 * ID parametresi validation
 */
export const settingsIdSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID sayı olmalıdır',
      'number.positive': 'ID pozitif sayı olmalıdır',
      'any.required': 'ID zorunludur'
    })
}); 