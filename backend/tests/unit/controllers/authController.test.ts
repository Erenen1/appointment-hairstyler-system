import { Request, Response, NextFunction } from 'express';
import { HashUtils, ApiError, ApiSuccess } from '../../../src/utils';
import { adminLogin, logout, getCurrentUser } from '../../../src/controllers/authController';
import db from '../../../src/models';

const { Admin } = db;

// Mock the database models
jest.mock('../../../src/models', () => ({
  Admin: {
    findOne: jest.fn(),
    update: jest.fn()
  }
}));

describe('Auth Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let responseObject: any = {};

  beforeEach(() => {
    jest.clearAllMocks();

          mockRequest = {
      body: {},
      session: {
        destroy: jest.fn().mockImplementation((cb) => { cb(null); return {} as any; }),
        save: jest.fn((cb) => cb(null)),
        user: null
      } as any
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
      clearCookie: jest.fn()
    };

    mockNext = jest.fn();
  });

  describe('adminLogin', () => {
    const validLoginData = {
      email: 'test@admin.com',
      password: 'Test123!'
    };

    const mockAdminData = {
      id: 1,
      email: 'test@admin.com',
      password: 'hashedPassword',
      fullName: 'Test Admin',
      isActive: true,
      update: jest.fn().mockResolvedValue(true)
    };

    it('başarılı giriş yapmalı', async () => {
      // Arrange
      jest.spyOn(HashUtils, 'verifyPassword').mockReturnValue(true);
      (Admin.findOne as jest.Mock).mockResolvedValue(mockAdminData);
      mockRequest.body = validLoginData;

      // Act
      await adminLogin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(responseObject).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.objectContaining({
              id: mockAdminData.id,
              email: mockAdminData.email,
              userType: 'admin'
            })
          })
        })
      );
      expect(mockRequest.session.user).toEqual(
        expect.objectContaining({
          id: mockAdminData.id,
          email: mockAdminData.email,
          userType: 'admin'
        })
      );
    });

    it('geçersiz email için hata vermeli', async () => {
      // Arrange
      (Admin.findOne as jest.Mock).mockResolvedValue(null);
      mockRequest.body = validLoginData;

      // Act
      await adminLogin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email veya şifre hatalı'
        })
      );
    });

    it('geçersiz şifre için hata vermeli', async () => {
      // Arrange
      jest.spyOn(HashUtils, 'verifyPassword').mockReturnValue(false);
      (Admin.findOne as jest.Mock).mockResolvedValue(mockAdminData);
      mockRequest.body = validLoginData;

      // Act
      await adminLogin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email veya şifre hatalı'
        })
      );
    });

    it('geçersiz veri için validasyon hatası vermeli', async () => {
      // Arrange
      mockRequest.body = {
        email: 'invalid-email',
        password: '123'
      };

      // Act
      await adminLogin(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'VALIDATION_ERROR'
        })
      );
    });
  });

  describe('logout', () => {
    it('başarılı çıkış yapmalı', async () => {
      // Act
      await logout(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockRequest.session.destroy).toHaveBeenCalled();
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('sessionid');
      expect(responseObject).toEqual(
        expect.objectContaining({
          success: true,
          message: 'Çıkış başarılı'
        })
      );
    });

    it('session destroy hatası için hata vermeli', async () => {

        // Arrange
      mockRequest.session.destroy = jest.fn().mockImplementation((cb) => { 
        cb(new Error('Session destroy error')); 
        return {} as any; 
      });

      // Act
      await logout(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Çıkış işlemi sırasında hata oluştu'
        })
      );
    });
  });

  describe('getCurrentUser', () => {
    it('mevcut kullanıcı bilgilerini getirmeli', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@admin.com',
        userType: 'admin' as 'admin' | 'staff',
        fullName: 'Test Admin'
      };
      mockRequest.session.user = mockUser;

      // Act
      await getCurrentUser(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(responseObject).toEqual(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: mockUser
          })
        })
      );
    });
  });
}); 