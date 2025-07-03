export const authPaths = {
  '/auth/admin/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Admin girişi',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Giriş başarılı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginResponse' }
            }
          }
        },
        401: {
          description: 'Geçersiz kimlik bilgileri',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Çıkış yap',
      security: [{ sessionAuth: [] }],
      responses: {
        200: {
          description: 'Çıkış başarılı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LogoutResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/auth/profile': {
    get: {
      tags: ['Authentication'],
      summary: 'Mevcut kullanıcı bilgisi',
      security: [{ sessionAuth: [] }],
      responses: {
        200: {
          description: 'Kullanıcı bilgileri',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProfileResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  }
}; 