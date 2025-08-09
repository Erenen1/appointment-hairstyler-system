export const staffSchemas = {
  Staff: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      businessId: { type: 'string', format: 'uuid' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      email: { type: 'string', format: 'email', nullable: true },
      phone: { type: 'string', nullable: true },
      specialization: { type: 'string', nullable: true },
      description: { type: 'string', nullable: true },
      avatar: { type: 'string', nullable: true },
      isAvailable: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateStaffRequest: {
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: { type: 'string', description: 'Personel adı' },
      lastName: { type: 'string', description: 'Personel soyadı' },
      email: { type: 'string', format: 'email', description: 'Personel e-posta adresi (isteğe bağlı)', nullable: true },
      phone: { type: 'string', description: 'Personel telefon numarası (isteğe bağlı)', nullable: true },
      specialization: { type: 'string', description: 'Uzmanlık alanı (isteğe bağlı)', nullable: true },
      description: { type: 'string', description: 'Açıklama (isteğe bağlı)', nullable: true },
      avatar: { type: 'string', format: 'binary', description: 'Avatar resmi (isteğe bağlı)' },
    },
  },
  UpdateStaffRequest: {
    type: 'object',
    properties: {
      firstName: { type: 'string', description: 'Personel adı' },
      lastName: { type: 'string', description: 'Personel soyadı' },
      email: { type: 'string', format: 'email', description: 'Personel e-posta adresi (isteğe bağlı)', nullable: true },
      phone: { type: 'string', description: 'Personel telefon numarası (isteğe bağlı)', nullable: true },
      specialization: { type: 'string', description: 'Uzmanlık alanı (isteğe bağlı)', nullable: true },
      description: { type: 'string', description: 'Açıklama (isteğe bağlı)', nullable: true },
      avatar: { type: 'string', format: 'binary', description: 'Avatar resmi (isteğe bağlı)' },
      isAvailable: { type: 'boolean', description: 'Personelin müsait olup olmadığı' },
    },
  },
  StaffListResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Staff' },
      },
      pagination: { $ref: '#/components/schemas/PaginationResponse' },
    },
  },
  StaffBasic: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      avatar: { type: 'string', nullable: true },
    },
  },
  AvailableSlot: {
    type: 'object',
    properties: {
      startTime: { type: 'string', format: 'time' },
      endTime: { type: 'string', format: 'time' },
    },
  },
  AvailableSlotsResponse: {
    type: 'object',
    properties: {
      date: { type: 'string', format: 'date' },
      slots: {
        type: 'array',
        items: { $ref: '#/components/schemas/AvailableSlot' },
      },
    },
  },
  AvailableSlotsRangeResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/AvailableSlotsResponse' },
      },
    },
  },
}; 