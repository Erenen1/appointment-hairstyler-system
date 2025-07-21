import config from '../../config/env';

export const healthPaths = {
  [`/health`]: {
    get: {
      tags: ['Health'],
      summary: 'API sağlık kontrolü',
      description: 'API\'nin çalışır durumda olup olmadığını kontrol eder.',
      responses: {
        '200': {
          description: 'API çalışıyor.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'ok' },
                  timestamp: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        '500': {
          description: 'Sunucu hatası. API düzgün çalışmıyor.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  [`/health/database`]: {
    get: {
      tags: ['Health'],
      summary: 'Veritabanı sağlık kontrolü',
      description: 'Veritabanı bağlantısının çalışır durumda olup olmadığını kontrol eder.',
      responses: {
        '200': {
          description: 'Veritabanı bağlantısı başarılı.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'ok' },
                  message: { type: 'string', example: 'Veritabanı bağlantısı başarılı.' },
                },
              },
            },
          },
        },
        '500': {
          description: 'Sunucu hatası. Veritabanı bağlantısı başarısız.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
}; 