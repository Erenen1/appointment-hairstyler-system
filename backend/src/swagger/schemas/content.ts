export const contentSchemas = {
  GalleryCategory: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Saç Modelleri' },
      description: { type: 'string', example: 'Saç modeli örnekleri' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  GalleryImage: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      title: { type: 'string', example: 'Saç Modeli 1' },
      description: { type: 'string', example: 'Modern saç kesimi örneği' },
      imageUrl: { type: 'string', example: '/uploads/gallery/image1.jpg' },
      categoryId: { type: 'integer', example: 1 },
      category: { $ref: '#/components/schemas/GalleryCategory' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  CreateGalleryImageRequest: {
    type: 'object',
    required: ['title', 'image', 'categoryId'],
    properties: {
      title: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Modeli 1' },
      description: { type: 'string', maxLength: 500, example: 'Modern saç kesimi örneği' },
      image: { type: 'string', format: 'binary', description: 'Galeri resmi dosyası' },
      categoryId: { type: 'integer', minimum: 1, example: 1 }
    }
  },
  UpdateGalleryImageRequest: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Modeli 1' },
      description: { type: 'string', maxLength: 500, example: 'Modern saç kesimi örneği' },
      categoryId: { type: 'integer', minimum: 1, example: 1 },
      isActive: { type: 'boolean', example: true }
    }
  },
  GalleryListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Galeri resimleri başarıyla listelendi' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/GalleryImage' }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  }
}; 