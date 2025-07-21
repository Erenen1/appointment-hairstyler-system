import config from '../../config/env';

export const availabilityPaths = {
  [`/availability/all`]: {
    get: {
      tags: ['Availability'],
      summary: 'Tüm personel müsaitliklerini getir',
      description: 'Tüm personelin müsaitliklerini sayfalama, arama ve filtreleme seçenekleriyle getirir.',
      parameters: [
        { $ref: '#/components/schemas/PageQuery' },
        { $ref: '#/components/schemas/LimitQuery' },
        { $ref: '#/components/schemas/SearchQuery' },
        {
          name: 'staffId',
          in: 'query',
          description: 'Personel ID\'si ile filtrele (isteğe bağlı)',
          required: false,
          schema: { type: 'string', format: 'uuid' },
        },
        {
          name: 'date',
          in: 'query',
          description: 'Tarihe göre filtrele (YYYY-MM-DD) (isteğe bağlı)',
          required: false,
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'startDate',
          in: 'query',
          description: 'Başlangıç tarihine göre filtrele (YYYY-MM-DD) (isteğe bağlı)',
          required: false,
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'endDate',
          in: 'query',
          description: 'Bitiş tarihine göre filtrele (YYYY-MM-DD) (isteğe bağlı)',
          required: false,
          schema: { type: 'string', format: 'date' },
        },
      ],
      responses: {
        '200': {
          description: 'Müsaitlikler başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AllStaffAvailabilityResponse',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`/availability`]: {
    get: {
      tags: ['Availability'],
      summary: 'Belirli bir personel için müsaitliği getir',
      description: 'Belirtilen personel ID\'si ve tarihi için müsaitliği getirir.',
      parameters: [
        {
          name: 'staffId',
          in: 'query',
          description: 'Personel ID\'si',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
        {
          name: 'date',
          in: 'query',
          description: 'Müsaitlik tarihi (YYYY-MM-DD)',
          required: true,
          schema: { type: 'string', format: 'date' },
        },
      ],
      responses: {
        '200': {
          description: 'Müsaitlik başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/StaffAvailability',
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    post: {
      tags: ['Availability'],
      summary: 'Yeni müsaitlik oluştur',
      description: 'Yeni bir personel müsaitliği oluşturmak için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateAvailabilityRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Müsaitlik başarıyla oluşturuldu.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/StaffAvailability',
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`/availability/bulk`]: {
    post: {
      tags: ['Availability'],
      summary: 'Toplu müsaitlik oluştur',
      description: 'Belirli bir tarih aralığı için toplu personel müsaitliği oluşturmak için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BulkCreateAvailabilityRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Toplu müsaitlik başarıyla oluşturuldu.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Toplu müsaitlik başarıyla oluşturuldu.' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`/availability/{id}`]: {
    put: {
      tags: ['Availability'],
      summary: 'Müsaitliği güncelle',
      description: 'Belirtilen ID\'ye sahip müsaitliği günceller.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateAvailabilityRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Müsaitlik başarıyla güncellendi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/StaffAvailability',
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    delete: {
      tags: ['Availability'],
      summary: 'Müsaitliği sil',
      description: 'Belirtilen ID\'ye sahip müsaitliği siler.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '204': {
          description: 'Müsaitlik başarıyla silindi (İçerik Yok).',
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
}; 