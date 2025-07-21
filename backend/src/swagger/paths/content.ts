import config from '../../config/env';

export const contentPaths = {
  [`${config.API_PREFIX}/gallery/categories`]: {
    get: {
      tags: ['Content'],
      summary: 'Tüm galeri kategorilerini getir',
      description: 'Tüm galeri kategorilerinin listesini sayfalama ve arama seçenekleriyle getirir.',
      parameters: [
        { $ref: '#/components/schemas/PageQuery' },
        { $ref: '#/components/schemas/LimitQuery' },
        { $ref: '#/components/schemas/SearchQuery' },
      ],
      responses: {
        '200': {
          description: 'Galeri kategorileri başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GalleryCategoryListResponse',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    post: {
      tags: ['Content'],
      summary: 'Yeni galeri kategorisi oluştur',
      description: 'Yeni bir galeri kategorisi oluşturmak için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateGalleryCategoryRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Galeri kategorisi başarıyla oluşturuldu.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GalleryCategory',
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
  [`${config.API_PREFIX}/gallery/categories/{id}`]: {
    get: {
      tags: ['Content'],
      summary: 'Belirli bir galeri kategorisini getir',
      description: 'Belirtilen ID\'ye sahip galeri kategorisini getirir.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '200': {
          description: 'Galeri kategorisi başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GalleryCategory',
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
      tags: ['Content'],
      summary: 'Galeri kategorisini güncelle',
      description: 'Belirtilen ID\'ye sahip galeri kategorisini günceller.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateGalleryCategoryRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Galeri kategorisi başarıyla güncellendi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GalleryCategory',
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
      tags: ['Content'],
      summary: 'Galeri kategorisini sil',
      description: 'Belirtilen ID\'ye sahip galeri kategorisini siler.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '204': {
          description: 'Galeri kategorisi başarıyla silindi (İçerik Yok).',
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`${config.API_PREFIX}/gallery/images`]: {
    get: {
      tags: ['Content'],
      summary: 'Tüm galeri resimlerini getir',
      description: 'Tüm galeri resimlerinin listesini sayfalama, arama ve kategori filtreleme seçenekleriyle getirir.',
      parameters: [
        { $ref: '#/components/schemas/PageQuery' },
        { $ref: '#/components/schemas/LimitQuery' },
        { $ref: '#/components/schemas/SearchQuery' },
        {
          name: 'categoryId',
          in: 'query',
          description: 'Kategori ID\'si ile filtrele (isteğe bağlı)',
          required: false,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      responses: {
        '200': {
          description: 'Galeri resimleri başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GalleryImageListResponse',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
    post: {
      tags: ['Content'],
      summary: 'Yeni galeri resmi oluştur',
      description: 'Yeni bir galeri resmi oluşturmak için kullanılır.',
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/CreateGalleryImageRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Galeri resmi başarıyla oluşturuldu.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GalleryImage',
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
  [`${config.API_PREFIX}/gallery/images/{id}`]: {
    get: {
      tags: ['Content'],
      summary: 'Belirli bir galeri resmini getir',
      description: 'Belirtilen ID\'ye sahip galeri resmini getirir.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '200': {
          description: 'Galeri resmi başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GalleryImage',
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
      tags: ['Content'],
      summary: 'Galeri resmini güncelle',
      description: 'Belirtilen ID\'ye sahip galeri resmini günceller.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              $ref: '#/components/schemas/UpdateGalleryImageRequest',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Galeri resmi başarıyla güncellendi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GalleryImage',
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
      tags: ['Content'],
      summary: 'Galeri resmini sil',
      description: 'Belirtilen ID\'ye sahip galeri resmini siler.',
      parameters: [
        { $ref: '#/components/schemas/IdParam' },
      ],
      responses: {
        '204': {
          description: 'Galeri resmi başarıyla silindi (İçerik Yok).',
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
}; 