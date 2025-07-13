export const staffPaths = {
  '/staff': {
    get: {
      tags: ['Staff'],
      summary: 'Personelleri listele',
      description: 'Personelleri sayfalama ve filtreleme ile listeler',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Sayfa numarası',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Sayfa başına öğe sayısı',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        },
        {
          name: 'search',
          in: 'query',
          description: 'Arama terimi',
          required: false,
          schema: { type: 'string' }
        },
        {
          name: 'isActive',
          in: 'query',
          description: 'Aktiflik durumu ile filtreleme',
          required: false,
          schema: { type: 'boolean' }
        },
        {
          name: 'sortBy',
          in: 'query',
          description: 'Sıralama alanı',
          required: false,
          schema: { type: 'string', enum: ['firstName', 'lastName', 'createdAt'], default: 'firstName' }
        },
        {
          name: 'sortOrder',
          in: 'query',
          description: 'Sıralama yönü',
          required: false,
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' }
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
                  message: { type: 'string', example: 'Personeller başarıyla getirildi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Staff' }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      currentPage: { type: 'integer', example: 1 },
                      totalPages: { type: 'integer', example: 5 },
                      totalItems: { type: 'integer', example: 50 },
                      itemsPerPage: { type: 'integer', example: 10 },
                      hasNextPage: { type: 'boolean', example: true },
                      hasPrevPage: { type: 'boolean', example: false }
                    }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    post: {
      tags: ['Staff'],
      summary: 'Yeni personel oluştur',
      description: 'Yeni personel oluşturur ve hizmet ilişkilerini kurar',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['fullName', 'email', 'phone', 'specialties'],
              properties: {
                fullName: { type: 'string', minLength: 2, maxLength: 50, example: 'Mehmet Özkan' },
                email: { type: 'string', format: 'email', example: 'mehmet@salon.com' },
                phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 987 6543' },
                specialties: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Kesimi ve Boyama' },
                serviceIds: { 
                  type: 'string', 
                  example: '["123e4567-e89b-12d3-a456-426614174000", "456e7890-e12b-34d5-a678-901234567890"]',
                  description: 'JSON string formatında service ID dizisi'
                },
                avatar: { type: 'string', format: 'binary', description: 'Avatar resmi dosyası' }
              }
            }
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
          description: 'Email adresi zaten kullanımda',
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
      description: 'Belirtilen ID\'ye sahip personelin detaylarını getirir',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Personel ID\'si',
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Personel detayları başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Personel detayları başarıyla getirildi' },
                  data: { $ref: '#/components/schemas/Staff' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
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
    },
    put: {
      tags: ['Staff'],
      summary: 'Personel güncelle',
      description: 'Personel bilgilerini günceller ve hizmet ilişkilerini yeniden kurar',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Personel ID\'si',
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                fullName: { type: 'string', minLength: 2, maxLength: 50, example: 'Mehmet Özkan' },
                email: { type: 'string', format: 'email', example: 'mehmet@salon.com' },
                phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 987 6543' },
                specialties: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Kesimi ve Boyama' },
                serviceIds: { 
                  type: 'array', 
                  items: { type: 'string', format: 'uuid' }, 
                  example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e12b-34d5-a678-901234567890']
                },
                avatar: { type: 'string', format: 'binary', description: 'Avatar resmi dosyası' },
                isActive: { type: 'boolean', example: true }
              }
            }
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
          description: 'Email adresi zaten kullanımda',
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
      description: 'Belirtilen tarihte personelin müsait saatlerini getirir',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Personel ID\'si',
          schema: { type: 'string', format: 'uuid' }
        },
        {
          name: 'date',
          in: 'query',
          required: true,
          description: 'Müsaitlik kontrolü yapılacak tarih',
          schema: { type: 'string', format: 'date' }
        },
        {
          name: 'serviceId',
          in: 'query',
          required: false,
          description: 'Hizmet ID\'si (belirtilirse hizmet süresine göre hesaplanır)',
          schema: { type: 'string', format: 'uuid' }
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
  },
  '/staff/{id}/available-slots-range': {
    get: {
      tags: ['Staff'],
      summary: 'Personel tarih aralığı müsaitlik durumu',
      description: 'Belirtilen tarih aralığında personelin müsaitlik durumunu getirir',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Personel ID\'si',
          schema: { type: 'string', format: 'uuid' }
        },
        {
          name: 'startDate',
          in: 'query',
          required: true,
          description: 'Başlangıç tarihi',
          schema: { type: 'string', format: 'date' }
        },
        {
          name: 'endDate',
          in: 'query',
          required: true,
          description: 'Bitiş tarihi',
          schema: { type: 'string', format: 'date' }
        },
        {
          name: 'serviceId',
          in: 'query',
          required: false,
          description: 'Hizmet ID\'si (belirtilirse hizmet süresine göre hesaplanır)',
          schema: { type: 'string', format: 'uuid' }
        }
      ],
      responses: {
        200: {
          description: 'Tarih aralığı müsaitlik durumu başarıyla getirildi',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AvailableSlotsRangeResponse' }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        404: {
          description: 'Personel bulunamadı veya aktif değil',
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