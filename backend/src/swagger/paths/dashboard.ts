/**
 * Dashboard API Paths
 */

export const dashboardPaths = {
  '/api/v1/dashboard/stats': {
    get: {
      tags: ['Dashboard'],
      summary: 'Dashboard istatistikleri',
      description: 'Ana dashboard sayfası için gerekli tüm istatistikleri getirir',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Dashboard istatistikleri başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Dashboard istatistikleri başarıyla getirildi' },
                  data: { $ref: '#/components/schemas/DashboardStats' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        401: {
          description: 'Yetkisiz erişim',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        403: {
          description: 'Admin yetkisi gerekli',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        500: {
          description: 'Sunucu hatası',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        }
      }
    }
  },

  '/api/v1/dashboard/revenue-chart': {
    get: {
      tags: ['Dashboard'],
      summary: 'Gelir grafiği verileri',
      description: 'Aylık gelir analizi için grafik verilerini getirir',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'months',
          in: 'query',
          description: 'Kaç aylık veri getirileceği',
          required: false,
          schema: {
            type: 'number',
            minimum: 1,
            maximum: 12,
            default: 6,
            example: 6
          }
        }
      ],
      responses: {
        200: {
          description: 'Gelir grafiği verileri başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Gelir grafiği verileri başarıyla getirildi' },
                  data: { $ref: '#/components/schemas/RevenueChartData' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },

  '/api/v1/dashboard/popular-services': {
    get: {
      tags: ['Dashboard'],
      summary: 'Popüler hizmetler',
      description: 'En çok tercih edilen hizmetleri getirir',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          description: 'Kaç tane hizmet getirileceği',
          required: false,
          schema: {
            type: 'number',
            minimum: 1,
            maximum: 20,
            default: 5,
            example: 5
          }
        }
      ],
      responses: {
        200: {
          description: 'Popüler hizmetler başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Popüler hizmetler başarıyla getirildi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/PopularService' }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },

  '/api/v1/dashboard/recent-appointments': {
    get: {
      tags: ['Dashboard'],
      summary: 'Son randevular',
      description: 'En son oluşturulan randevuları getirir',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          description: 'Kaç tane randevu getirileceği',
          required: false,
          schema: {
            type: 'number',
            minimum: 1,
            maximum: 50,
            default: 10,
            example: 10
          }
        }
      ],
      responses: {
        200: {
          description: 'Son randevular başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Son randevular başarıyla getirildi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/RecentAppointment' }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  }
}; 