// backend/tests/unit/controllers/healthController.test.ts
import { Request, Response, NextFunction } from 'express';
import { HealthController } from '../../../src/controllers/healthController';
import { healthCheck } from '../../../src/config/database';
import logger from '../../../src/config/logger';

// Mock dependencies
jest.mock('../../../src/config/database');
jest.mock('../../../src/config/logger');

describe('HealthController Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSystemHealth', () => {
    it('should return 200 and system health if database is healthy', async () => {
      const mockHealthCheckResponse = {
        status: 'healthy',
        responseTime: '10ms',
        database: 'test_db',
        host: 'localhost'
      };

      (healthCheck as jest.Mock).mockResolvedValue(mockHealthCheckResponse);

      await HealthController.getSystemHealth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Sistem sağlıklı çalışıyor',
          data: expect.objectContaining({
            status: 'OK',
            database: mockHealthCheckResponse
          })
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 503 and system error if database is unhealthy', async () => {
      const mockUnhealthyResponse = {
        status: 'unhealthy',
        error: 'DB connection failed',
        database: 'test_db',
        host: 'localhost'
      };

      (healthCheck as jest.Mock).mockResolvedValue(mockUnhealthyResponse);

      await HealthController.getSystemHealth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(503);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Sistem sağlık kontrolünde sorun tespit edildi'
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with ApiError on unexpected error', async () => {
      const error = new Error('Test error');
      (healthCheck as jest.Mock).mockRejectedValue(error);

      await HealthController.getSystemHealth(mockRequest as Request, mockResponse as Response, mockNext);

      expect(logger.error).toHaveBeenCalledWith('System health check failed', expect.objectContaining({ error: 'Test error' }));
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ 
        statusCode: 500, 
        message: 'Sağlık kontrolü yapılamadı' 
      }));
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});