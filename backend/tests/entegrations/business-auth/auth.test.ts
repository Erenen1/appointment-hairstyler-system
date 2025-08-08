import supertest from "supertest";
import { describe, it, expect } from '@jest/globals';
import app from '../../../src/app';
import { BusinessRegisterDto } from '../../../src/modules/business-auth/business-auth.interface';
const apiKey = process.env.SUPER_ADMIN_API_KEY;

describe('Business Auth API Tests', () => {
  const createDto: BusinessRegisterDto = {
    email: "erencelikk212@gmail.com",
    password: "password123",
    businessName: "Test Kuaför Salonu",
    ownerName: "Test Owner",
    phone: "+905551234567",
    address: "Test Mahallesi No:1",
  }
  describe('POST /auth/register', () => {
    it('Geçersiz API anahtarı ile hesap oluşturma denemesi', async () => {
      console.log(apiKey)
      const response = await supertest(app)
        .post('/auth/register')
        .set('x-api-key', `${apiKey}`)
        .send(createDto);

      console.log(response.body);
      // expect(response.status).toBe(201);
    })

  });
});