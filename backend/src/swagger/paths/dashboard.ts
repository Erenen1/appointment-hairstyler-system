export const dashboardPaths = {
  '/dashboard/stats': {
    get: {
      tags: ['Dashboard'],
      summary: 'Dashboard istatistikleri',
      description: 'Günlük, aylık ve genel istatistikleri getirir',
      security: [{ sessionAuth: [] }],
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
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        500: { $ref: '#/components/responses/InternalError' }
      }
    }
  },
  '/dashboard/revenue-chart': {
    get: {
      tags: ['Dashboard'],
      summary: 'Gelir grafiği',
      description: 'Aylık gelir grafiği verilerini getirir',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          name: 'months',
          in: 'query',
          schema: { type: 'integer', default: 6, minimum: 1, maximum: 12 },
          description: 'Kaç aylık veri gösterileceği'
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
                  data: { $ref: '#/components/schemas/RevenueChart' },
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
  '/dashboard/popular-services': {
    get: {
      tags: ['Dashboard'],
      summary: 'Popüler hizmetler',
      description: 'En çok tercih edilen hizmetleri getirir',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 5, minimum: 1, maximum: 20 },
          description: 'Kaç hizmet gösterileceği'
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
  '/dashboard/recent-appointments': {
    get: {
      tags: ['Dashboard'],
      summary: 'Son randevular',
      description: 'En son oluşturulan randevuları getirir',
      security: [{ sessionAuth: [] }],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 10, minimum: 1, maximum: 50 },
          description: 'Kaç randevu gösterileceği'
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