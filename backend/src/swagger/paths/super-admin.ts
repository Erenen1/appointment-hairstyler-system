import config from '../../config/env';

export const superAdminPaths = {
  [`/super-admin/login`]: {
    post: {
      tags: ['Super Admin'],
      summary: 'Süper Yönetici girişi',
      description: 'Süper yöneticinin sisteme API Key ile giriş yapması için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['apiKey'],
              properties: {
                apiKey: { type: 'string', description: 'Süper Yönetici API Anahtarı' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Giriş başarılı.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Süper Yönetici Girişi Başarılı' },
                },
              },
            },
          },
        },
        '401': {
          description: 'Yetkisiz. Geçersiz API Anahtarı.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
}; 