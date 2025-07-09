export const servicePaths = {
  '/services': {
    get: {
      tags: ['Services'],
      summary: 'Hizmetleri listele',
      description: 'Tüm aktif hizmetleri listeler',
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
          description: 'Hizmetler başarıyla listelendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Hizmetler başarıyla listelendi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Service' }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    post: {
      tags: ['Services'],
      summary: 'Yeni hizmet oluştur',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateServiceRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Hizmet başarıyla oluşturuldu',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Hizmet başarıyla oluşturuldu' },
                  data: { $ref: '#/components/schemas/Service' },
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
          description: 'Kategori bulunamadı',
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
  '/services/categories': {
    get: {
      tags: ['Services'],
      summary: 'Hizmet kategorilerini listele',
      responses: {
        200: {
          description: 'Kategoriler başarıyla listelendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Kategoriler başarıyla listelendi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ServiceCategory' }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        500: { $ref: '#/components/responses/InternalError' }
      }
    },
    post: {
      tags: ['Services'],
      summary: 'Yeni kategori oluştur',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateCategoryRequest' }
          }
        }
      },
      responses: {
        201: {
          description: 'Kategori başarıyla oluşturuldu',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Kategori başarıyla oluşturuldu' },
                  data: { $ref: '#/components/schemas/ServiceCategory' },
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
  '/services/{id}': {
    get: {
      tags: ['Services'],
      summary: 'Hizmet detayı',
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
          description: 'Hizmet detayı',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Hizmet detayı getirildi' },
                  data: { $ref: '#/components/schemas/Service' },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        404: {
          description: 'Hizmet bulunamadı',
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
      tags: ['Services'],
      summary: 'Hizmet güncelle',
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
            schema: { $ref: '#/components/schemas/UpdateServiceRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Hizmet başarıyla güncellendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Hizmet başarıyla güncellendi' },
                  data: { $ref: '#/components/schemas/Service' },
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
          description: 'Hizmet bulunamadı',
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
      tags: ['Services'],
      summary: 'Hizmet sil',
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
          description: 'Hizmet başarıyla silindi',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiSuccessResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        404: {
          description: 'Hizmet bulunamadı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        409: {
          description: 'Hizmet aktif randevularda kullanılıyor',
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
  '/services/{id}/staff': {
    get: {
      tags: ['Services'],
      summary: 'Hizmeti veren personelleri getir',
      description: 'Belirli bir hizmeti verebilen aktif personelleri listeler',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Hizmet ID',
          schema: { type: 'integer', minimum: 1 }
        }
      ],
      responses: {
        200: {
          description: 'Hizmeti veren personeller başarıyla getirildi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Hizmeti veren personeller başarıyla getirildi' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ServiceStaffMember' }
                  },
                  timestamp: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        },
        404: {
          description: 'Hizmet bulunamadı',
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
  '/services/categories/{id}': {
    put: {
      tags: ['Services'],
      summary: 'Kategori güncelle',
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
            schema: { $ref: '#/components/schemas/UpdateCategoryRequest' }
          }
        }
      },
      responses: {
        200: {
          description: 'Kategori başarıyla güncellendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Kategori başarıyla güncellendi' },
                  data: { $ref: '#/components/schemas/ServiceCategory' },
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
          description: 'Kategori bulunamadı',
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
      tags: ['Services'],
      summary: 'Kategori sil',
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
          description: 'Kategori başarıyla silindi',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiSuccessResponse' }
            }
          }
        },
        401: { $ref: '#/components/responses/UnauthorizedError' },
        403: { $ref: '#/components/responses/ForbiddenError' },
        404: {
          description: 'Kategori bulunamadı',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' }
            }
          }
        },
        409: {
          description: 'Kategori hizmetlerde kullanılıyor',
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