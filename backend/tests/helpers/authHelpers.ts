import request from 'supertest';
import app from '../../src/app';
import { TestHelpers } from './testHelpers';

export class AuthHelpers {
  static async loginAdmin(credentials?: { username?: string; password?: string }) {
    const defaultCredentials = {
      username: 'testadmin',
      password: 'testpassword123'
    };

    const loginData = { ...defaultCredentials, ...credentials };

    const response = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(loginData);

    return response;
  }

  static async createAndLoginAdmin(adminData?: any) {
    // Önce admin oluştur
    await TestHelpers.createTestAdmin({
      username: 'testadmin',
      password: 'hashedpassword123', // Bu normalde hash'lenmiş olmalı
      ...adminData
    });

    // Sonra login ol
    return await this.loginAdmin();
  }

  static async registerCustomer(customerData?: any) {
    const defaultData = {
      firstName: 'Test',
      lastName: 'Customer',
      email: TestHelpers.generateRandomEmail(),
      phone: TestHelpers.generateRandomPhone(),
      password: 'testpassword123'
    };

    const registerData = { ...defaultData, ...customerData };

    const response = await request(app)
      .post('/api/v1/auth/customer/register')
      .send(registerData);

    return response;
  }

  static async loginCustomer(credentials?: { email?: string; password?: string }) {
    const defaultCredentials = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const loginData = { ...defaultCredentials, ...credentials };

    const response = await request(app)
      .post('/api/v1/auth/customer/login')
      .send(loginData);

    return response;
  }

  static async createAndLoginCustomer(customerData?: any) {
    // Önce customer kaydet
    const registerResponse = await this.registerCustomer(customerData);
    
    if (registerResponse.status !== 201) {
      throw new Error('Customer registration failed');
    }

    // Sonra login ol
    return await this.loginCustomer({
      email: customerData?.email || registerResponse.body.data.email,
      password: customerData?.password || 'testpassword123'
    });
  }

  static getAuthHeader(token: string): object {
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  static extractTokenFromResponse(response: any): string {
    return response.body.data.token || response.body.token;
  }

  static extractSessionFromResponse(response: any): string {
    const cookies = response.headers['set-cookie'];
    if (!cookies) return '';
    
    const sessionCookie = cookies.find((cookie: string) => 
      cookie.startsWith('connect.sid=')
    );
    
    return sessionCookie || '';
  }
} 