import config from '../../config/env';

export const contactPaths = {
  [`/contact`]: {
    get: {
      tags: ['Contact'],
      summary: 'Tüm iletişim mesajlarını getir',
      description: 'Tüm iletişim mesajlarının listesini sayfalama ve arama seçenekleriyle getirir.',
      parameters: [
        { $ref: '#/components/schemas/PageQuery' },
        { $ref: '#/components/schemas/LimitQuery' },
        { $ref: '#/components/schemas/SearchQuery' },
        {
          name: 'replied',
          in: 'query',
          description: 'Yanıtlanmış mesajları filtrele (true/false)',
          required: false,
          schema: {
            type: 'boolean',
          },
        },
      ],
      responses: {
        '200': {
          description: 'İletişim mesajları başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ContactMessageListResponse',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    post: {
      tags: ['Contact'],
      summary: 'Yeni iletişim mesajı gönder',
      description: 'Yeni bir iletişim mesajı göndermek için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateContactMessageRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Mesaj başarıyla gönderildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ContactMessage',
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`/contact/{id}`]: {
    get: {
      tags: ['Contact'],
      summary: 'Belirli bir iletişim mesajını getir',
      description: 'Belirtilen ID\'ye sahip iletişim mesajını getirir.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '200': {
          description: 'İletişim mesajı başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ContactMessage',
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
      tags: ['Contact'],
      summary: 'İletişim mesajını güncelle',
      description: 'Belirtilen ID\'ye sahip iletişim mesajını günceller. Genellikle mesajı yanıtlandı olarak işaretlemek için kullanılır.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateContactMessageRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'İletişim mesajı başarıyla güncellendi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ContactMessage',
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
      tags: ['Contact'],
      summary: 'İletişim mesajını sil',
      description: 'Belirtilen ID\'ye sahip iletişim mesajını siler.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '204': {
          description: 'İletişim mesajı başarıyla silindi (İçerik Yok).',
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
}; 