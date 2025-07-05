export const staffPaths = {
  '/staff': {
    get: {
      tags: ['Staff'],
      summary: 'Personelleri listele',
      parameters: [
        {
          name: 'isActive',
          in: 'query',
          description: 'Aktiflik durumu ile filtreleme',
          required: false,
          schema: { type: 'boolean' }
        }
      ],
      responses: {
        200: {
          description: 'Personeller başarıyla listelendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Personeller başarıyla listelendi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Staff' }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    post: {
      tags: ['Staff'],
      summary: 'Yeni personel oluştur',
      security: [{ sessionAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateStaffRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Personel başarıyla oluşturuldu',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Personel başarıyla oluşturuldu' },
                  data: { $ref: '#/components/schemas/Staff' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        409: {
          description: 'Telefon veya email zaten kullanımda',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/staff/{id}': {
    get: {
      tags: ['Staff'],
      summary: 'Personel detayı',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        200: {
          description: 'Personel detayı',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Personel detayı getirildi' },
                  data: { $ref: '#/components/schemas/Staff' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        404: {
          description: 'Personel bulunamadı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    put: {
      tags: ['Staff'],
      summary: 'Personel güncelle',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateStaffRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Personel başarıyla güncellendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Personel başarıyla güncellendi' },
                  data: { $ref: '#/components/schemas/Staff' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        404: {
          description: 'Personel bulunamadı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        409: {
          description: 'Telefon veya email zaten kullanımda',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/staff/{id}/available-slots': {
    get: {
      tags: ['Staff'],
      summary: 'Personel müsait saatleri',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        },
        {
          name: 'date',
          in: 'query',
          required: true,
          schema: { type: 'string', format: 'date' }
        }
      ],
      responses: {
        200: {
          description: 'Müsait saatler başarıyla getirildi',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AvailableSlotsResponse' }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        404: {
          description: 'Personel bulunamadı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  }
}; 