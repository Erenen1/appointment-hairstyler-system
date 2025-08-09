export const categorySchemas = {
  Category: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      businessId: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      description: { type: 'string', nullable: true },
      image: { type: 'string', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateCategoryRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', description: 'Kategori adı' },
      description: { type: 'string', description: 'Kategori açıklaması (isteğe bağlı)', nullable: true },
      image: { type: 'string', format: 'binary', description: 'Kategori resmi (isteğe bağlı)' },
    },
  },
  UpdateCategoryRequest: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Kategori adı' },
      description: { type: 'string', description: 'Kategori açıklaması (isteğe bağlı)', nullable: true },
      image: { type: 'string', format: 'binary', description: 'Kategori resmi (isteğe bağlı)' },
    },
  },
  CategoryListResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Category' },
      },
      pagination: { $ref: '#/components/schemas/PaginationResponse' },
    },
  },
}; 