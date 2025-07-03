import { Request, Response, NextFunction } from 'express';
import { HashUtils, ApiError, ApiSuccess } from '../../../src/utils';
import { createAdminWithApiKey } from '../../../src/controllers/adminController';
import db from '../../../src/models';

const { Admin } = db;

// Mock the database models
jest.mock('../../../src/models', () => ({
  Admin: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

describe('Admin Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let responseObject: any = {};

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock request and response
    mockRequest = {
      body: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      })
    };

    mockNext = jest.fn();
  });

  describe('createAdminWithApiKey', () => {
    const validAdminData = {
      fullName: 'Test Admin',
      email: 'test@admin.com',
      password: 'Test123!',
      phone: '5551234567',
      isActive: true
    };

    it('başarılı bir şekilde yeni admin oluşturmalı', async () => {
      // Arrange
      const hashedPassword = 'hashedPassword123';
      jest.spyOn(HashUtils, 'hashPassword').mockReturnValue(hashedPassword);
      
      (Admin.findOne as jest.Mock).mockResolvedValue(null);
      (Admin.create as jest.Mock).mockResolvedValue({
        toJSON: () => ({ ...validAdminData, password: hashedPassword })
      });

      mockRequest.body = validAdminData;

      // Act
      await createAdminWithApiKey(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            fullName: validAdminData.fullName,
            email: validAdminData.email,
            phone: validAdminData.phone,
            isActive: validAdminData.isActive
          })
        })
      );
      expect(responseObject.data.password).toBeUndefined();
    });

    it('var olan email adresi için conflict hatası vermeli', async () => {
      // Arrange
      (Admin.findOne as jest.Mock).mockResolvedValue({ email: validAdminData.email });
      mockRequest.body = validAdminData;

      // Act
      await createAdminWithApiKey(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = mockNext.mock.calls[0][0] as ApiError;
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe('Bu e-posta adresi zaten kullanılıyor');
    });

    it('geçersiz veri için validasyon hatası vermeli', async () => {
      // Arrange
      mockRequest.body = {
        fullName: '', // Geçersiz isim
        email: 'invalid-email', // Geçersiz email
        password: '123', // Geçersiz şifre
        phone: '123' // Geçersiz telefon
      };

      // Act
      await createAdminWithApiKey(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(expect.any(ApiError));
      const error = mockNext.mock.calls[0][0] as ApiError;
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe('VALIDATION_ERROR');
    });
  });
}); 