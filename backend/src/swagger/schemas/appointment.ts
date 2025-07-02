/**
 * Appointment API Schemas
 */

export const appointmentSchemas = {
  Customer: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      firstName: { type: 'string', example: 'Ayşe' },
      lastName: { type: 'string', example: 'Demir' },
      email: { type: 'string', format: 'email', example: 'ayse.demir@email.com' },
      phone: { type: 'string', example: '+90 555 123 4567' },
      fullName: { type: 'string', example: 'Ayşe Demir' }
    }
  },

  Staff: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      firstName: { type: 'string', example: 'Zeynep' },
      lastName: { type: 'string', example: 'Yılmaz' },
      specialization: { type: 'string', example: 'Saç Kesimi, Boyama' },
      fullName: { type: 'string', example: 'Zeynep Yılmaz' }
    }
  },

  Service: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Saç Kesimi' },
      price: { type: 'number', example: 250.00 },
      duration: { type: 'number', example: 60 }
    }
  },

  AppointmentStatus: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'pending' },
      displayName: { type: 'string', example: 'Bekliyor' }
    }
  },

  Appointment: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 123 },
      customerId: { type: 'number', example: 1 },
      customer: { $ref: '#/components/schemas/Customer' },
      staffId: { type: 'number', example: 1 },
      staff: { $ref: '#/components/schemas/Staff' },
      serviceId: { type: 'number', example: 1 },
      service: { $ref: '#/components/schemas/Service' },
      appointmentDate: { type: 'string', format: 'date', example: '2024-12-15' },
      startTime: { type: 'string', example: '14:30' },
      endTime: { type: 'string', example: '15:30' },
      status: { $ref: '#/components/schemas/AppointmentStatus' },
      price: { type: 'number', example: 250.00 },
      discountAmount: { type: 'number', example: 0.00 },
      totalPrice: { type: 'number', example: 250.00 },
      notes: { type: 'string', example: 'Özel istek notları' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },

  CreateAppointmentRequest: {
    type: 'object',
    required: ['customer', 'serviceId', 'staffId', 'appointmentDate', 'startTime'],
    properties: {
      customer: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'phone'],
        properties: {
          firstName: { type: 'string', minLength: 2, maxLength: 50, example: 'Ayşe' },
          lastName: { type: 'string', minLength: 2, maxLength: 50, example: 'Demir' },
          email: { type: 'string', format: 'email', example: 'ayse.demir@email.com' },
          phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 123 4567' }
        }
      },
      serviceId: { type: 'number', minimum: 1, example: 1 },
      staffId: { type: 'number', minimum: 1, example: 1 },
      appointmentDate: { type: 'string', format: 'date', example: '2024-12-15' },
      startTime: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', example: '14:30' },
      notes: { type: 'string', maxLength: 500, example: 'Özel istek notları' }
    }
  },

  UpdateAppointmentStatusRequest: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { 
        type: 'string', 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        example: 'confirmed'
      },
      notes: { type: 'string', maxLength: 500, example: 'Randevu onaylandı' }
    }
  },

  CalendarEvent: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 123 },
      title: { type: 'string', example: 'Ayşe Demir - Saç Kesimi' },
      start: { type: 'string', format: 'date-time', example: '2024-12-15T14:30:00' },
      end: { type: 'string', format: 'date-time', example: '2024-12-15T15:30:00' },
      backgroundColor: { type: 'string', example: '#ffc107' },
      borderColor: { type: 'string', example: '#ffc107' },
      extendedProps: {
        type: 'object',
        properties: {
          customerName: { type: 'string', example: 'Ayşe Demir' },
          serviceName: { type: 'string', example: 'Saç Kesimi' },
          staffName: { type: 'string', example: 'Zeynep Yılmaz' },
          phone: { type: 'string', example: '+90 555 123 4567' },
          status: { type: 'string', example: 'Bekliyor' },
          statusName: { type: 'string', example: 'pending' },
          price: { type: 'number', example: 250.00 },
          discountAmount: { type: 'number', example: 0.00 },
          totalPrice: { type: 'number', example: 250.00 },
          notes: { type: 'string', example: 'Özel istek notları' }
        }
      }
    }
  }
}; 