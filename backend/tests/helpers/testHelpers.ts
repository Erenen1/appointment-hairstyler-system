import { TestDatabase } from '../setup/testDatabase';

export class TestHelpers {
  static async createTestUser(userData: any = {}) {
    const models = TestDatabase.getModels();
    const defaultData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '05551234567',
      ...userData
    };
    
    return await models.Customer.create(defaultData);
  }

  static async createTestAdmin(adminData: any = {}) {
    const models = TestDatabase.getModels();
    const defaultData = {
      username: 'testadmin',
      password: 'hashedpassword123',
      fullName: 'Test Admin',
      email: 'admin@test.com',
      isActive: true,
      ...adminData
    };
    
    return await models.Admin.create(defaultData);
  }

  static async createTestStaff(staffData: any = {}) {
    const models = TestDatabase.getModels();
    const defaultData = {
      name: 'Test Staff',
      email: 'staff@test.com',
      phone: '05551234567',
      specialization: 'Hair Cut',
      experience: 5,
      isActive: true,
      ...staffData
    };
    
    return await models.Staff.create(defaultData);
  }

  static async createTestService(serviceData: any = {}) {
    const models = TestDatabase.getModels();
    
    // Önce category oluştur
    const category = await models.ServiceCategory.create({
      name: 'Test Category',
      description: 'Test category description',
      isActive: true
    });

    const defaultData = {
      name: 'Test Service',
      description: 'Test service description',
      duration: 60,
      price: 100,
      categoryId: category.id,
      isActive: true,
      ...serviceData
    };
    
    return await models.Service.create(defaultData);
  }

  static async createTestAppointment(appointmentData: any = {}) {
    const models = TestDatabase.getModels();
    
    // Gerekli bağımlılıkları oluştur
    const customer = await this.createTestUser();
    const staff = await this.createTestStaff();
    const service = await this.createTestService();
    
    // Status oluştur
    const status = await models.AppointmentStatus.create({
      name: 'Pending',
      description: 'Appointment is pending',
      color: '#yellow'
    });

    const defaultData = {
      customerId: customer.id,
      staffId: staff.id,
      serviceId: service.id,
      statusId: status.id,
      appointmentDate: new Date(),
      startTime: '10:00',
      endTime: '11:00',
      notes: 'Test appointment',
      ...appointmentData
    };
    
    return await models.Appointment.create(defaultData);
  }

  // Utility functions
  static generateRandomEmail(): string {
    return `test${Math.random().toString(36).substring(7)}@example.com`;
  }

  static generateRandomPhone(): string {
    return `0555${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`;
  }

  static getFutureDate(days: number = 7): Date {
    const future = new Date();
    future.setDate(future.getDate() + days);
    return future;
  }

  static getPastDate(days: number = 7): Date {
    const past = new Date();
    past.setDate(past.getDate() - days);
    return past;
  }
} 