import config from '../../config/env';

export const categoryPaths = {
  [`/categories`]: {
    get: {
      tags: ['Categories'],
      summary: 'Tüm kategorileri getir',
      description: 'Tüm kategorilerin listesini sayfalama ve arama seçenekleriyle getirir.',
      parameters: [
        { $ref: '#/components/schemas/PageQuery' },
        { $ref: '#/components/schemas/LimitQuery' },
        { $ref: '#/components/schemas/SearchQuery' },
      ],
      responses: {
        '200': {
          description: 'Kategoriler başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryListResponse',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    post: {
      tags: ['Categories'],
      summary: 'Yeni kategori oluştur',
      description: 'Yeni bir kategori oluşturmak için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/CreateCategoryRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Kategori başarıyla oluşturuldu.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Category',
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
  [`/categories/{id}`]: {
    get: {
      tags: ['Categories'],
      summary: 'Belirli bir kategoriyi getir',
      description: 'Belirtilen ID\'ye sahip kategoriyi getirir.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '200': {
          description: 'Kategori başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Category',
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
      tags: ['Categories'],
      summary: 'Kategoriyi güncelle',
      description: 'Belirtilen ID\'ye sahip kategoriyi günceller.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/UpdateCategoryRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Kategori başarıyla güncellendi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Category',
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
      tags: ['Categories'],
      summary: 'Kategoriyi sil',
      description: 'Belirtilen ID\'ye sahip kategoriyi siler.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '204': {
          description: 'Kategori başarıyla silindi (İçerik Yok).',
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
}; 