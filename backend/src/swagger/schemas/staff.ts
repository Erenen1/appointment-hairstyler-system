export const staffSchemas = {
  Staff: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      fullName: { type: 'string', example: 'Mehmet Özkan' },
      phone: { type: 'string', example: '+90 555 987 6543' },
      email: { type: 'string', format: 'email', example: 'mehmet@salon.com' },
      specialization: { type: 'string', example: 'Saç Kesimi ve Boyama' },
      isActive: { type: 'boolean', example: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  CreateStaffRequest: {
    type: 'object',
    required: ['fullName', 'phone', 'specialization'],
    properties: {
      fullName: { type: 'string', minLength: 2, maxLength: 100, example: 'Mehmet Özkan' },
      phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 987 6543' },
      email: { type: 'string', format: 'email', example: 'mehmet@salon.com' },
      specialization: { type: 'string', minLength: 2, maxLength: 200, example: 'Saç Kesimi ve Boyama' }
    }
  },
  UpdateStaffRequest: {
    type: 'object',
    properties: {
      fullName: { type: 'string', minLength: 2, maxLength: 100, example: 'Mehmet Özkan' },
      phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 987 6543' },
      email: { type: 'string', format: 'email', example: 'mehmet@salon.com' },
      specialization: { type: 'string', minLength: 2, maxLength: 200, example: 'Saç Kesimi ve Boyama' },
      isActive: { type: 'boolean', example: true }
    }
  },
  AvailableSlot: {
    type: 'object',
    properties: {
      startTime: { type: 'string', example: '09:00' },
      endTime: { type: 'string', example: '10:00' },
      isAvailable: { type: 'boolean', example: true }
    }
  },
  AvailableSlotsResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Müsait saatler getirildi' },
      data: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', example: '2024-01-15' },
          staffId: { type: 'integer', example: 1 },
          slots: {
            type: 'array',
            items: { $ref: '#/components/schemas/AvailableSlot' }
          }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  }
}; 