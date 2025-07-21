import config from '../../config/env';

export const customerPaths = {
  [`/customers`]: {
    get: {
      tags: ['Customers'],
      summary: 'Tüm müşterileri getir',
      description: 'Tüm müşterilerin listesini sayfalama ve arama seçenekleriyle getirir.',
      parameters: [
        { $ref: '#/components/schemas/PageQuery' },
        { $ref: '#/components/schemas/LimitQuery' },
        { $ref: '#/components/schemas/SearchQuery' },
      ],
      responses: {
        '200': {
          description: 'Müşteriler başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CustomerListResponse',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    post: {
      tags: ['Customers'],
      summary: 'Yeni müşteri oluştur',
      description: 'Yeni bir müşteri oluşturmak için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateCustomerRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Müşteri başarıyla oluşturuldu.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Customer',
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
  [`/customers/{id}`]: {
    get: {
      tags: ['Customers'],
      summary: 'Belirli bir müşteriyi getir',
      description: 'Belirtilen ID\'ye sahip müşteriyi getirir.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '200': {
          description: 'Müşteri başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Customer',
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
      tags: ['Customers'],
      summary: 'Müşteriyi güncelle',
      description: 'Belirtilen ID\'ye sahip müşteriyi günceller.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateCustomerRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Müşteri başarıyla güncellendi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Customer',
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
      tags: ['Customers'],
      summary: 'Müşteriyi sil',
      description: 'Belirtilen ID\'ye sahip müşteriyi siler.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '204': {
          description: 'Müşteri başarıyla silindi (İçerik Yok).',
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
}; 