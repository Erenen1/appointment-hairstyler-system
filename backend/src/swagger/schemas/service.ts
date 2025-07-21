export const serviceSchemas = {
  Service: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      businessId: { type: 'string', format: 'uuid' },
      categoryId: { type: 'string', format: 'uuid', nullable: true },
      name: { type: 'string' },
      description: { type: 'string', nullable: true },
      price: { type: 'number', format: 'float' },
      duration: { type: 'number', description: 'Hizmet süresi (dakika)' },
      image: { type: 'string', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateServiceRequest: {
    type: 'object',
    required: ['name', 'price', 'duration'],
    properties: {
      categoryId: { type: 'string', format: 'uuid', description: 'Kategori ID"si (isteğe bağlı)', nullable: true },
      name: { type: 'string', description: 'Hizmet adı' },
      description: { type: 'string', description: 'Hizmet açıklaması (isteğe bağlı)', nullable: true },
      price: { type: 'number', format: 'float', description: 'Hizmet fiyatı' },
      duration: { type: 'number', description: 'Hizmet süresi (dakika)' },
      image: { type: 'string', format: 'binary', description: 'Hizmet resmi (isteğe bağlı)' },
    },
  },
  UpdateServiceRequest: {
    type: 'object',
    properties: {
      categoryId: { type: 'string', format: 'uuid', description: 'Kategori ID"si (isteğe bağlı)', nullable: true },
      name: { type: 'string', description: 'Hizmet adı' },
      description: { type: 'string', description: 'Hizmet açıklaması (isteğe bağlı)', nullable: true },
      price: { type: 'number', format: 'float', description: 'Hizmet fiyatı' },
      duration: { type: 'number', description: 'Hizmet süresi (dakika)' },
      image: { type: 'string', format: 'binary', description: 'Hizmet resmi (isteğe bağlı)' },
    },
  },
  ServiceListResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Service' },
      },
      pagination: { $ref: '#/components/schemas/PaginationResponse' },
    },
  },
  ServiceCategory: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      description: { type: 'string', nullable: true },
    },
  },
  ServiceStaffMember: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
  },
  ServiceStaffAvailabilityResponse: {
    type: 'object',
    properties: {
      staff: { $ref: '#/components/schemas/ServiceStaffMember' },
      availableSlots: {
        type: 'array',
        items: { type: 'string', format: 'time' },
      },
    },
  },
}; 