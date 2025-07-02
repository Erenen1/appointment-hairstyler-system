export const appointmentPaths = {
  '/api/v1/appointments': {
    get: {
      tags: ['Appointments'],
      summary: 'Randevu listesi',
      description: 'Filtreleme ve sayfalama ile randevu listesini getirir',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Sayfa numarası',
          required: false,
          schema: { type: 'number', minimum: 1, default: 1, example: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Sayfa başına kayıt sayısı',
          required: false,
          schema: { type: 'number', minimum: 1, maximum: 100, default: 10, example: 10 }
        },
        {
          name: 'startDate',
          in: 'query',
          description: 'Başlangıç tarihi (YYYY-MM-DD)',
          required: false,
          schema: { type: 'string', format: 'date', example: '2024-12-01' }
        },
        {
          name: 'endDate',
          in: 'query',
          description: 'Bitiş tarihi (YYYY-MM-DD)',
          required: false,
          schema: { type: 'string', format: 'date', example: '2024-12-31' }
        },
        {
          name: 'staffId',
          in: 'query',
          description: 'Personel ID',
          required: false,
          schema: { type: 'number', minimum: 1, example: 1 }
        },
        {
          name: 'customerId',
          in: 'query',
          description: 'Müşteri ID',
          required: false,
          schema: { type: 'number', minimum: 1, example: 1 }
        },
        {
          name: 'serviceId',
          in: 'query',
          description: 'Hizmet ID',
          required: false,
          schema: { type: 'number', minimum: 1, example: 1 }
        },
        {
          name: 'status',
          in: 'query',
          description: 'Randevu durumu',
          required: false,
          schema: { 
            type: 'string', 
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            example: 'pending'
          }
        },
        {
          name: 'sortBy',
          in: 'query',
          description: 'Sıralama alanı',
          required: false,
          schema: { 
            type: 'string', 
                      enum: ['appointmentDate', 'createdAt', 'customer_name', 'service_name'],
          default: 'appointmentDate',
          example: 'appointmentDate'
          }
        },
        {
          name: 'sortOrder',
          in: 'query',
          description: 'Sıralama yönü',
          required: false,
          schema: { 
            type: 'string', 
            enum: ['asc', 'desc'],
            default: 'desc',
            example: 'desc'
          }
        }
      ],
      responses: {
        200: {
          description: 'Randevu listesi başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Randevu listesi başarıyla getirildi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Appointment' }
                  },
                  pagination: { $ref: '#/components/schemas/PaginationInfo' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    post: {
      tags: ['Appointments'],
      summary: 'Yeni randevu oluştur',
      description: 'Yeni bir randevu oluşturur. Müşteri mevcut değilse otomatik oluşturulur.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAppointmentRequest' },
            example: {
              customer: {
                firstName: 'Ayşe',
                lastName: 'Demir',
                email: 'ayse.demir@email.com',
                phone: '+90 555 123 4567'
              },
              serviceId: 1,
              staffId: 1,
              appointmentDate: '2024-12-15',
              startTime: '14:30',
              notes: 'Özel istek notları'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Randevu başarıyla oluşturuldu',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Randevu başarıyla oluşturuldu' },
                  data: { $ref: '#/components/schemas/Appointment' },
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
          description: 'Hizmet veya personel bulunamadı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        409: {
          description: 'Zaman çakışması',
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
  '/api/v1/appointments/calendar': {
    get: {
      tags: ['Appointments'],
      summary: 'Takvim randevuları',
      description: 'Takvim görünümü için randevuları getirir',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'startDate',
          in: 'query',
          description: 'Başlangıç tarihi (YYYY-MM-DD)',
          required: true,
          schema: { type: 'string', format: 'date', example: '2024-12-01' }
        },
        {
          name: 'endDate',
          in: 'query',
          description: 'Bitiş tarihi (YYYY-MM-DD)',
          required: true,
          schema: { type: 'string', format: 'date', example: '2024-12-31' }
        },
        {
          name: 'staffId',
          in: 'query',
          description: 'Personel ID (opsiyonel)',
          required: false,
          schema: { type: 'number', minimum: 1, example: 1 }
        }
      ],
      responses: {
        200: {
          description: 'Takvim randevuları başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Takvim randevuları başarıyla getirildi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CalendarEvent' }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/api/v1/appointments/{id}': {
    get: {
      tags: ['Appointments'],
      summary: 'Randevu detayı',
      description: 'Belirtilen ID\'ye sahip randevunun detaylarını getirir',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Randevu ID',
          required: true,
          schema: { type: 'number', minimum: 1, example: 123 }
        }
      ],
      responses: {
        200: {
          description: 'Randevu detayı başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Randevu detayı başarıyla getirildi' },
                  data: { $ref: '#/components/schemas/Appointment' },
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
          description: 'Randevu bulunamadı',
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
  '/api/v1/appointments/{id}/status': {
    put: {
      tags: ['Appointments'],
      summary: 'Randevu durumu güncelle',
      description: 'Randevunun durumunu günceller ve geçmişe kaydeder',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          description: 'Randevu ID',
          required: true,
          schema: { type: 'number', minimum: 1, example: 123 }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateAppointmentStatusRequest' },
            example: {
              status: 'confirmed',
              notes: 'Randevu onaylandı'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Randevu durumu başarıyla güncellendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Randevu durumu başarıyla güncellendi' },
                  data: { $ref: '#/components/schemas/Appointment' },
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
          description: 'Randevu bulunamadı',
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