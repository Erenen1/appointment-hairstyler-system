export const contentPaths = {
  '/content/gallery': {
    get: {
      tags: ['Content'],
      summary: 'Galeri resimlerini listele',
      parameters: [
        {
          name: 'categoryId',
          in: 'query',
          description: 'Kategori ID ile filtreleme',
          required: false,
          schema: { type: 'integer', minimum: 1 }
        },
        {
          name: 'isActive',
          in: 'query',
          description: 'Aktiflik durumu ile filtreleme',
          required: false,
          schema: { type: 'boolean' }
        }
      ],
      responses: {
        200: {
          description: 'Galeri resimleri başarıyla listelendi',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GalleryListResponse' }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    post: {
      tags: ['Content'],
      summary: 'Yeni galeri resmi ekle',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: { $ref: '#/components/schemas/CreateGalleryImageRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Galeri resmi başarıyla eklendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Galeri resmi başarıyla eklendi' },
                  data: { $ref: '#/components/schemas/GalleryImage' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        400: { $ref: '#/components/responses/ValidationError' },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        413: {
          description: 'Dosya boyutu çok büyük',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        415: {
          description: 'Desteklenmeyen dosya formatı',
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
  '/content/gallery/{id}': {
    get: {
      tags: ['Content'],
      summary: 'Galeri resmi detayı',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        200: {
          description: 'Galeri resmi detayı',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Galeri resmi detayı getirildi' },
                  data: { $ref: '#/components/schemas/GalleryImage' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        404: {
          description: 'Galeri resmi bulunamadı',
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
      tags: ['Content'],
      summary: 'Galeri resmi güncelle',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateGalleryImageRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Galeri resmi başarıyla güncellendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Galeri resmi başarıyla güncellendi' },
                  data: { $ref: '#/components/schemas/GalleryImage' },
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
          description: 'Galeri resmi bulunamadı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    delete: {
      tags: ['Content'],
      summary: 'Galeri resmi sil',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer' }
        }
      ],
      responses: {
        200: {
          description: 'Galeri resmi başarıyla silindi',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiSuccessResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        404: {
          description: 'Galeri resmi bulunamadı',
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