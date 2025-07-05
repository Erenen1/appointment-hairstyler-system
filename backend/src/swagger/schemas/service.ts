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
      categoryId: { type: 'integer', example: 1 },
      slug: { type: 'string', example: 'sac-kesimi' },
      title: { type: 'string', example: 'Saç Kesimi' },
      description: { type: 'string', example: 'Profesyonel saç kesimi hizmeti' },
      duration: { type: 'string', example: '60' },
      price: { type: 'string', example: '100' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  CreateServiceRequest: {
    type: 'object',
    required: ['categoryId', 'title', 'duration', 'price'],
    properties: {
      slug: { type: 'string', minLength: 2, maxLength: 100, example: 'sac-kesimi' },
      categoryId: { type: 'integer', minimum: 1, example: 1 },
      title: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Kesimi' },
      description: { type: 'string', maxLength: 500, example: 'Profesyonel saç kesimi hizmeti' },
      duration: { type: 'string', example: '60' },
      price: { type: 'string', example: '100' },
    }
  },
  UpdateServiceRequest: {
    type: 'object',
    properties: {
      categoryId: { type: 'integer', minimum: 1, example: 1 },
      slug: { type: 'string', minLength: 2, maxLength: 100, example: 'sac-kesimi' },
      title: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Kesimi' },
      description: { type: 'string', maxLength: 500, example: 'Profesyonel saç kesimi hizmeti' },
      duration: { type: 'string', example: '60' },
      price: { type: 'string', example: '100' },
      isActive: { type: 'boolean', example: true },
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