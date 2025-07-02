export const TestData = {
  admin: {
    valid: {
      username: 'testadmin',
      password: 'testpassword123',
      fullName: 'Test Admin',
      email: 'admin@test.com',
      isActive: true
    },
    invalid: {
      invalidUsername: {
        username: '',
        password: 'testpassword123'
      },
      shortPassword: {
        username: 'testadmin',
        password: '123'
      },
      invalidEmail: {
        username: 'testadmin2',
        password: 'testpassword123',
        name: 'Test Admin 2',
        email: 'invalid-email',
        role: 'admin'
      }
    }
  },

  customer: {
    valid: {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'customer@test.com',
      phone: '05551234567',
      password: 'testpassword123'
    },
    invalid: {
      invalidEmail: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'invalid-email',
        phone: '05551234567',
        password: 'testpassword123'
      },
      invalidPhone: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'customer2@test.com',
        phone: '123',
        password: 'testpassword123'
      }
    }
  },

  staff: {
    valid: {
      name: 'Test Staff',
      email: 'staff@test.com',
      phone: '05551234567',
      specialization: 'Hair Styling',
      experience: 5,
      isActive: true,
      workingHours: {
        monday: { start: '09:00', end: '18:00', isWorking: true },
        tuesday: { start: '09:00', end: '18:00', isWorking: true },
        wednesday: { start: '09:00', end: '18:00', isWorking: true },
        thursday: { start: '09:00', end: '18:00', isWorking: true },
        friday: { start: '09:00', end: '18:00', isWorking: true },
        saturday: { start: '09:00', end: '16:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      }
    }
  },

  service: {
    valid: {
      name: 'Hair Cut',
      description: 'Professional hair cutting service',
      duration: 30,
      price: 50,
      isActive: true
    },
    category: {
      name: 'Hair Services',
      description: 'All hair related services',
      isActive: true
    }
  },

  appointment: {
    valid: {
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Yarın
      startTime: '10:00',
      endTime: '10:30',
      notes: 'Test appointment',
      customerNotes: 'Please be on time'
    },
    status: {
      pending: {
        name: 'Pending',
        description: 'Appointment is pending approval',
        color: '#FFA500'
      },
      confirmed: {
        name: 'Confirmed',
        description: 'Appointment is confirmed',
        color: '#008000'
      },
      cancelled: {
        name: 'Cancelled',
        description: 'Appointment is cancelled',
        color: '#FF0000'
      },
      completed: {
        name: 'Completed',
        description: 'Appointment is completed',
        color: '#0000FF'
      }
    }
  },

  businessInfo: {
    valid: {
      businessName: 'Test Kuaför Salonu',
      address: 'Test Mah. Test Sok. No:1',
      city: 'Istanbul',
      district: 'Kadıköy',
      phone: '02161234567',
      email: 'info@testkuafor.com',
      description: 'Test kuaför salonu açıklaması',
      isActive: true
    }
  },

  businessHours: {
    valid: {
      dayOfWeek: 1, // Pazartesi
      openTime: '09:00',
      closeTime: '18:00',
      isOpen: true
    }
  },

  contactMessage: {
    valid: {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '05551234567',
      subject: 'Test Message',
      message: 'This is a test contact message',
      isRead: false
    }
  }
}; 