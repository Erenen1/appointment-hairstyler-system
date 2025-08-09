export const customerSchemas = {
  Customer: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      businessId: { type: 'string', format: 'uuid' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string', format: 'email', nullable: true },
      phone: { type: 'string', nullable: true },
      notes: { type: 'string', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateCustomerRequest: {
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: { type: 'string', description: 'Müşteri adı' },
      lastName: { type: 'string', description: 'Müşteri soyadı' },
      email: { type: 'string', format: 'email', description: 'Müşteri e-posta adresi (isteğe bağlı)', nullable: true },
      phone: { type: 'string', description: 'Müşteri telefon numarası (isteğe bağlı)', nullable: true },
      notes: { type: 'string', description: 'Müşteri notları (isteğe bağlı)', nullable: true },
    },
  },
  UpdateCustomerRequest: {
    type: 'object',
    properties: {
      firstName: { type: 'string', description: 'Müşteri adı' },
      lastName: { type: 'string', description: 'Müşteri soyadı' },
      email: { type: 'string', format: 'email', description: 'Müşteri e-posta adresi (isteğe bağlı)', nullable: true },
      phone: { type: 'string', description: 'Müşteri telefon numarası (isteğe bağlı)', nullable: true },
      notes: { type: 'string', description: 'Müşteri notları (isteğe bağlı)', nullable: true },
    },
  },
  CustomerListResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Customer' },
      },
      pagination: { $ref: '#/components/schemas/PaginationResponse' },
    },
  },
}; 