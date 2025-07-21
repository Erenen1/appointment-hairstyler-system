export const authSchemas = {
  BusinessRegister: {
    type: 'object',
    required: ['email', 'password', 'businessName', 'phone'],
    properties: {
      email: { type: 'string', format: 'email', description: 'İşletme e-posta adresi' },
      password: { type: 'string', format: 'password', description: 'İşletme şifresi' },
      businessName: { type: 'string', description: 'İşletme adı' },
      phone: { type: 'string', description: 'İşletme telefon numarası' },
      address: { type: 'string', description: 'İşletme adresi (isteğe bağlı)' },
      city: { type: 'string', description: 'İşletme şehri (isteğe bağlı)' },
      country: { type: 'string', description: 'İşletme ülkesi (isteğe bağlı)' },
      website: { type: 'string', description: 'İşletme web sitesi (isteğe bağlı)' },
    },
    example: {
      email: 'test@business.com',
      password: 'password123',
      businessName: 'Test Kuaför Salonu',
      phone: '+905551234567',
      address: 'Test Mahallesi No:1',
      city: 'İstanbul',
      country: 'Türkiye',
      website: 'https://www.testkuafor.com',
    },
  },
  BusinessLogin: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', description: 'İşletme e-posta adresi' },
      password: { type: 'string', format: 'password', description: 'İşletme şifresi' },
    },
    example: {
      email: 'test@business.com',
      password: 'password123',
    },
  },
  Business: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email' },
      businessName: { type: 'string' },
      phone: { type: 'string' },
      address: { type: 'string' },
      city: { type: 'string' },
      country: { type: 'string' },
      website: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  Error: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      status: { type: 'number' },
    },
  },
}; 