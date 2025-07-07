export const getAllStaffAvailability = {
  get: {
    tags: ['Availability'],
    summary: 'Tüm personellerin müsaitlik durumlarını getir',
    description: 'Belirli tarih aralığında tüm personellerin müsaitlik durumlarını ve randevularını getirir',
    parameters: [
      {
        name: 'startDate',
        in: 'query',
        required: true,
        description: 'Başlangıç tarihi (YYYY-MM-DD)',
        schema: {
          type: 'string',
          format: 'date'
        }
      },
      {
        name: 'endDate',
        in: 'query',
        required: true,
        description: 'Bitiş tarihi (YYYY-MM-DD)',
        schema: {
          type: 'string',
          format: 'date'
        }
      },
      {
        name: 'serviceId',
        in: 'query',
        required: false,
        description: 'Belirli hizmeti veren personelleri filtrele',
        schema: {
          type: 'integer'
        }
      }
    ],
    responses: {
      200: {
        description: 'Başarılı',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AllStaffAvailabilityResponse'
            }
          }
        }
      },
      400: {
        description: 'Geçersiz parametreler',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      }
    }
  }
};

export const getStaffAvailability = {
  get: {
    tags: ['Availability'],
    summary: 'Müsaitlik kayıtlarını getir',
    description: 'Filtreleme ile müsaitlik kayıtlarını getirir',
    parameters: [
      {
        name: 'staffId',
        in: 'query',
        required: false,
        description: 'Personel ID',
        schema: {
          type: 'string',
          format: 'uuid'
        }
      },
      {
        name: 'date',
        in: 'query',
        required: false,
        description: 'Belirli tarih (YYYY-MM-DD)',
        schema: {
          type: 'string',
          format: 'date'
        }
      },
      {
        name: 'startDate',
        in: 'query',
        required: false,
        description: 'Başlangıç tarihi (YYYY-MM-DD)',
        schema: {
          type: 'string',
          format: 'date'
        }
      },
      {
        name: 'endDate',
        in: 'query',
        required: false,
        description: 'Bitiş tarihi (YYYY-MM-DD)',
        schema: {
          type: 'string',
          format: 'date'
        }
      },
      {
        name: 'type',
        in: 'query',
        required: false,
        description: 'Müsaitlik tipi',
        schema: {
          type: 'string',
          enum: ['default', 'custom', 'off']
        }
      },
      {
        name: 'isAvailable',
        in: 'query',
        required: false,
        description: 'Müsaitlik durumu',
        schema: {
          type: 'boolean'
        }
      }
    ],
    responses: {
      200: {
        description: 'Başarılı',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                message: {
                  type: 'string',
                  example: 'Müsaitlik durumları başarıyla getirildi'
                },
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/StaffAvailability'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const createAvailability = {
  post: {
    tags: ['Availability'],
    summary: 'Yeni müsaitlik kaydı oluştur',
    description: 'Personel için yeni müsaitlik kaydı oluşturur (Sadece admin)',
    security: [
      {
        bearerAuth: []
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/CreateAvailability'
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Müsaitlik kaydı başarıyla oluşturuldu',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                message: {
                  type: 'string',
                  example: 'Müsaitlik kaydı başarıyla oluşturuldu'
                },
                data: {
                  $ref: '#/components/schemas/StaffAvailability'
                }
              }
            }
          }
        }
      },
      400: {
        description: 'Geçersiz veri',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      },
      409: {
        description: 'Bu tarih için zaten kayıt mevcut',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      }
    }
  }
};

export const bulkCreateAvailability = {
  post: {
    tags: ['Availability'],
    summary: 'Toplu müsaitlik kaydı oluştur',
    description: 'Personel için belirli tarih aralığında toplu müsaitlik kaydı oluşturur (Sadece admin)',
    security: [
      {
        bearerAuth: []
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/BulkCreateAvailability'
          },
          examples: {
            weekdays: {
              summary: 'Hafta içi çalışma planı',
              value: {
                staffId: 'uuid-string',
                dateRange: {
                  startDate: '2024-01-01',
                  endDate: '2024-01-31'
                },
                workingDays: [1, 2, 3, 4, 5],
                schedule: {
                  startTime: '09:00',
                  endTime: '18:00',
                  lunchBreakStart: '12:00',
                  lunchBreakEnd: '13:00'
                }
              }
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Toplu müsaitlik kayıtları başarıyla oluşturuldu',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                message: {
                  type: 'string',
                  example: '15 adet müsaitlik kaydı başarıyla oluşturuldu'
                },
                data: {
                  type: 'object',
                  properties: {
                    count: {
                      type: 'integer',
                      example: 15
                    },
                    records: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/StaffAvailability'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      400: {
        description: 'Geçersiz veri veya oluşturulacak kayıt bulunamadı',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      }
    }
  }
};

export const updateAvailability = {
  put: {
    tags: ['Availability'],
    summary: 'Müsaitlik kaydını güncelle',
    description: 'Mevcut müsaitlik kaydını günceller (Sadece admin)',
    security: [
      {
        bearerAuth: []
      }
    ],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Müsaitlik kaydı ID',
        schema: {
          type: 'integer'
        }
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateAvailability'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Müsaitlik kaydı başarıyla güncellendi',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                message: {
                  type: 'string',
                  example: 'Müsaitlik kaydı başarıyla güncellendi'
                },
                data: {
                  $ref: '#/components/schemas/StaffAvailability'
                }
              }
            }
          }
        }
      },
      404: {
        description: 'Müsaitlik kaydı bulunamadı',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      }
    }
  }
};

export const deleteAvailability = {
  delete: {
    tags: ['Availability'],
    summary: 'Müsaitlik kaydını sil',
    description: 'Müsaitlik kaydını siler (Sadece admin)',
    security: [
      {
        bearerAuth: []
      }
    ],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Müsaitlik kaydı ID',
        schema: {
          type: 'integer'
        }
      }
    ],
    responses: {
      200: {
        description: 'Müsaitlik kaydı başarıyla silindi',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                message: {
                  type: 'string',
                  example: 'Müsaitlik kaydı başarıyla silindi'
                }
              }
            }
          }
        }
      },
      404: {
        description: 'Müsaitlik kaydı bulunamadı',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse'
            }
          }
        }
      }
    }
  }
}; 