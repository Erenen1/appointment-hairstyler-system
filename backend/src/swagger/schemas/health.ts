export const healthSchemas = {
  HealthStatus: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'ok' },
      timestamp: { type: 'string', format: 'date-time' },
    },
  },
  DatabaseHealthStatus: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'ok' },
      message: { type: 'string', example: 'Veritabanı bağlantısı başarılı.' },
    },
  },
}; 