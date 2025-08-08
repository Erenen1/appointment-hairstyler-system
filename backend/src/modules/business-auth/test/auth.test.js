import request from 'supertest';
import app  from '../../../app'; // Adjust path as needed

describe('Business Auth API Tests', () => {
    const testBusiness = {
        email: 'test@business.com',
        password: 'password123',
        businessName: 'Test Kuaför Salonu',
        phone: '+905551234567',
        address: 'Test Mahallesi No:1',
        city: 'İstanbul',
        country: 'Türkiye',
        website: 'https://www.testkuafor.com'
    };
    console.log('Test Business:', testBusiness);

    describe('POST /api/auth/register', () => {
        it('should register a new business successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testBusiness)
                .expect(201);

            expect(res.body).toHaveProperty('id');
            expect(res.body.email).toBe(testBusiness.email);
            expect(res.body.businessName).toBe(testBusiness.businessName);
            expect(res.body).not.toHaveProperty('password');
        });

        it('should fail registration with missing required fields', async () => {
            const invalidBusiness = {
                email: 'test@business.com',
                password: 'password123'
            };

            const res = await request(app)
                .post('/api/auth/register')
                .send(invalidBusiness)
                .expect(400);

            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('status', 400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const loginCredentials = {
                email: testBusiness.email,
                password: testBusiness.password
            };

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginCredentials)
                .expect(200);

            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('business');
            expect(res.body.business.email).toBe(loginCredentials.email);
        });

        it('should fail login with invalid credentials', async () => {
            const invalidCredentials = {
                email: 'wrong@email.com',
                password: 'wrongpassword'
            };

            const res = await request(app)
                .post('/api/auth/login')
                .send(invalidCredentials)
                .expect(401);

            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('status', 401);
        });
    });

    // Clean up test data after tests
    afterAll(async () => {
        // Add cleanup logic here if needed
        // For example, delete test business from database
    });
});