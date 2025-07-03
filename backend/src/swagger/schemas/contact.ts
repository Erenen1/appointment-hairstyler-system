export const contactSchemas = {
  ContactMessage: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      fullName: { type: 'string', example: 'Ali Veli' },
      email: { type: 'string', format: 'email', example: 'ali@example.com' },
      phone: { type: 'string', example: '+90 555 444 3322' },
      subject: { type: 'string', example: 'Randevu Talebi' },
      message: { type: 'string', example: 'Merhaba, randevu almak istiyorum.' },
      isRead: { type: 'boolean', example: false },
      status: { type: 'string', enum: ['new', 'read', 'replied', 'closed'], example: 'new' },
      category: { type: 'string', example: 'general' },
      adminNotes: { type: 'string', example: 'Müşteri ile iletişime geçildi' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  CreateContactMessageRequest: {
    type: 'object',
    required: ['fullName', 'email', 'subject', 'message'],
    properties: {
      fullName: { type: 'string', minLength: 2, maxLength: 100, example: 'Ali Veli' },
      email: { type: 'string', format: 'email', example: 'ali@example.com' },
      phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 444 3322' },
      subject: { type: 'string', minLength: 2, maxLength: 200, example: 'Randevu Talebi' },
      message: { type: 'string', minLength: 10, maxLength: 1000, example: 'Merhaba, randevu almak istiyorum.' }
    }
  },
  ContactMessageListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'İletişim mesajları başarıyla listelendi' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/ContactMessage' }
      },
      pagination: { $ref: '#/components/schemas/PaginationInfo' },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },
  ContactStatsResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'İletişim istatistikleri getirildi' },
      data: {
        type: 'object',
        properties: {
          totalMessages: { type: 'integer', example: 125 },
          unreadMessages: { type: 'integer', example: 15 },
          todayMessages: { type: 'integer', example: 5 },
          weekMessages: { type: 'integer', example: 25 },
          monthMessages: { type: 'integer', example: 78 }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  }
}; 