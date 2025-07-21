export const appointmentSchemas = {
  Appointment: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      businessId: { type: 'string', format: 'uuid' },
      customerId: { type: 'string', format: 'uuid' },
      staffId: { type: 'string', format: 'uuid' },
      serviceId: { type: 'string', format: 'uuid' },
      appointmentDate: { type: 'string', format: 'date' },
      startTime: { type: 'string', format: 'time' },
      endTime: { type: 'string', format: 'time' },
      status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
      totalPrice: { type: 'number', format: 'float' },
      notes: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateAppointmentRequest: {
    type: 'object',
    required: ['customerId', 'staffId', 'serviceId', 'appointmentDate', 'startTime', 'endTime', 'totalPrice'],
    properties: {
      customerId: { type: 'string', format: 'uuid' },
      staffId: { type: 'string', format: 'uuid' },
      serviceId: { type: 'string', format: 'uuid' },
      appointmentDate: { type: 'string', format: 'date', example: '2024-12-31' },
      startTime: { type: 'string', format: 'time', example: '10:00' },
      endTime: { type: 'string', format: 'time', example: '11:00' },
      totalPrice: { type: 'number', format: 'float', example: 50.00 },
      notes: { type: 'string', example: 'Müşteri notu.', nullable: true },
    },
  },
  UpdateAppointmentRequest: {
    type: 'object',
    properties: {
      customerId: { type: 'string', format: 'uuid' },
      staffId: { type: 'string', format: 'uuid' },
      serviceId: { type: 'string', format: 'uuid' },
      appointmentDate: { type: 'string', format: 'date', example: '2024-12-31' },
      startTime: { type: 'string', format: 'time', example: '10:00' },
      endTime: { type: 'string', format: 'time', example: '11:00' },
      status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
      totalPrice: { type: 'number', format: 'float', example: 50.00 },
      notes: { type: 'string', example: 'Müşteri notu.', nullable: true },
    },
  },
  AppointmentListResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Appointment' },
      },
      pagination: { $ref: '#/components/schemas/PaginationResponse' },
    },
  },
}; 