import config from '../../config/env';

export const authPaths = {
  [`${config.API_PREFIX}/business-auth/register`]: {
    post: {
      tags: ['Business Auth'],
      summary: 'Yeni bir işletme kaydı',
      description: 'Yeni bir işletmenin sisteme kaydedilmesi için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BusinessRegister',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'İşletme başarıyla kaydedildi.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'İşletme başarıyla kaydedildi.' },
                },
              },
            },
          },
        },
        '400': {
          description: 'Hatalı istek. E-posta zaten kayıtlı olabilir veya eksik alanlar var.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '500': {
          description: 'Sunucu hatası.',
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
  [`${config.API_PREFIX}/business-auth/login`]: {
    post: {
      tags: ['Business Auth'],
      summary: 'İşletme girişi',
      description: 'Kayıtlı bir işletmenin sisteme giriş yapması için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BusinessLogin',
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
                  token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  business: {
                    $ref: '#/components/schemas/Business',
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Kimlik doğrulama başarısız. Geçersiz kimlik bilgileri.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '500': {
          description: 'Sunucu hatası.',
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