import config from '../../config/env';

export const appointmentPaths = {
  [`/appointments`]: {
    get: {
      tags: ['Appointments'],
      summary: 'Tüm randevuları getir',
      description: 'Tüm randevuların listesini sayfalama ve arama seçenekleriyle getirir.',
      parameters: [
        { $ref: '#/components/schemas/PageQuery' },
        { $ref: '#/components/schemas/LimitQuery' },
        { $ref: '#/components/schemas/SearchQuery' },
        {
          name: 'status',
          in: 'query',
          description: 'Randevu durumu filtrelemesi',
          required: false,
          schema: {
            type: 'string',
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
          },
        },
        {
          name: 'startDate',
          in: 'query',
          description: 'Başlangıç tarihi (YYYY-MM-DD)',
          required: false,
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'endDate',
          in: 'query',
          description: 'Bitiş tarihi (YYYY-MM-DD)',
          required: false,
          schema: { type: 'string', format: 'date' },
        },
      ],
      responses: {
        '200': {
          description: 'Randevular başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AppointmentListResponse',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    post: {
      tags: ['Appointments'],
      summary: 'Yeni randevu oluştur',
      description: 'Yeni bir randevu oluşturmak için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateAppointmentRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Randevu başarıyla oluşturuldu.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Appointment',
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
  [`/appointments/{id}`]: {
    get: {
      tags: ['Appointments'],
      summary: 'Belirli bir randevuyu getir',
      description: 'Belirtilen ID\'ye sahip randevuyu getirir.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '200': {
          description: 'Randevu başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Appointment',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    put: {
      tags: ['Appointments'],
      summary: 'Randevuyu güncelle',
      description: 'Belirtilen ID\'ye sahip randevuyu günceller.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateAppointmentRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Randevu başarıyla güncellendi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Appointment',
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
      tags: ['Appointments'],
      summary: 'Randevuyu sil',
      description: 'Belirtilen ID\'ye sahip randevuyu siler.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '204': {
          description: 'Randevu başarıyla silindi (İçerik Yok).',
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
}; 