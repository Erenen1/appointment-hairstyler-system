export const serviceSchemas = {
  ServiceCategory: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Saç Bakımı' },
      description: { type: 'string', example: 'Saç bakım hizmetleri' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Service: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Saç Kesimi' },
      description: { type: 'string', example: 'Profesyonel saç kesimi hizmeti' },
      price: { type: 'number', format: 'decimal', example: 100 },
      duration: { type: 'integer', example: 60, description: 'Dakika cinsinden süre' },
      categoryId: { type: 'integer', example: 1 },
      category: { $ref: '#/components/schemas/ServiceCategory' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  CreateServiceRequest: {
    type: 'object',
    required: ['name', 'price', 'duration', 'categoryId'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Kesimi' },
      description: { type: 'string', maxLength: 500, example: 'Profesyonel saç kesimi hizmeti' },
      price: { type: 'number', minimum: 0, example: 100 },
      duration: { type: 'integer', minimum: 1, example: 60 },
      categoryId: { type: 'integer', minimum: 1, example: 1 }
    }
  },
  UpdateServiceRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Kesimi' },
      description: { type: 'string', maxLength: 500, example: 'Profesyonel saç kesimi hizmeti' },
      price: { type: 'number', minimum: 0, example: 100 },
      duration: { type: 'integer', minimum: 1, example: 60 },
      categoryId: { type: 'integer', minimum: 1, example: 1 },
      isActive: { type: 'boolean', example: true }
    }
  },
  CreateCategoryRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Bakımı' },
      description: { type: 'string', maxLength: 500, example: 'Saç bakım hizmetleri' }
    }
  },
  UpdateCategoryRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Bakımı' },
      description: { type: 'string', maxLength: 500, example: 'Saç bakım hizmetleri' },
      isActive: { type: 'boolean', example: true }
    }
  }
}; 