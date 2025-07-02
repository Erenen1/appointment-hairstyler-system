import { Request, Response, NextFunction } from 'express';
import { ApiSuccess, ApiError } from '../utils';
import { healthCheck } from '../config/database';
import { Enum } from '../config/env';
import logger from '../config/logger';

/**
 * Error tipini güvenli şekilde handle eden yardımcı fonksiyon
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Bilinmeyen hata';
};

/**
 * Health Check Controller
 */
export class HealthController {

  /**
   * Genel sistem sağlık durumu
   */
  static async getSystemHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbHealth = await healthCheck();
      
      const systemHealth = {
        status: dbHealth.status === 'healthy' ? 'OK' : 'ERROR',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: Enum.NODE_ENV,
        version: process.version,
        platform: process.platform,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024)
        },
        database: dbHealth
      };

      if (dbHealth.status === 'healthy') {
        const response = ApiSuccess.item(systemHealth, 'Sistem sağlıklı çalışıyor');
        res.json(response);
      } else {
        res.status(503).json(
          ApiError.internal('Sistem sağlık kontrolünde sorun tespit edildi').toJSON()
        );
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logger.error('System health check failed', { error: errorMessage });
      next(ApiError.internal('Sağlık kontrolü yapılamadı'));
    }
  }

  /**
   * Database sağlık durumu
   */
  static async getDatabaseHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await healthCheck();
      
      if (health.status === 'healthy') {
        const response = ApiSuccess.item(health, 'Database bağlantısı sağlıklı');
        res.json(response);
      } else {
        res.status(503).json(
          ApiError.database('Database bağlantısında sorun var').toJSON()
        );
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logger.error('Database health check failed', { error: errorMessage });
      next(ApiError.database('Database sağlık kontrolü yapılamadı'));
    }
  }

  /**
   * Server bilgileri
   */
  static async getServerInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const serverInfo = {
        application: {
          name: 'Kuaför Backend API',
          version: '1.0.0',
          environment: Enum.NODE_ENV,
          port: Enum.PORT,
          startTime: new Date(Date.now() - process.uptime() * 1000).toISOString()
        },
        runtime: {
          node: process.version,
          platform: process.platform,
          arch: process.arch,
          uptime: process.uptime(),
          pid: process.pid
        },
        system: {
          totalMemory: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          usedMemory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          freeMemory: Math.round((process.memoryUsage().heapTotal - process.memoryUsage().heapUsed) / 1024 / 1024),
          externalMemory: Math.round(process.memoryUsage().external / 1024 / 1024)
        },
        database: {
          name: Enum.DB_NAME,
          host: Enum.DB_HOST,
          port: Enum.DB_PORT
        }
      };

      const response = ApiSuccess.item(serverInfo, 'Server bilgileri getirildi');
      res.json(response);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logger.error('Server info failed', { error: errorMessage });
      next(ApiError.internal('Server bilgileri alınamadı'));
    }
  }

  /**
   * Liveness probe (Kubernetes için)
   */
  static async liveness(req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
  }

  /**
   * Readiness probe (Kubernetes için)
   */
  static async readiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbHealth = await healthCheck();
      
      if (dbHealth.status === 'healthy') {
        res.status(200).json({ 
          status: 'ready', 
          timestamp: new Date().toISOString(),
          checks: {
            database: 'healthy'
          }
        });
      } else {
        res.status(503).json({ 
          status: 'not ready', 
          timestamp: new Date().toISOString(),
          checks: {
            database: 'unhealthy'
          }
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      res.status(503).json({ 
        status: 'not ready', 
        timestamp: new Date().toISOString(),
        error: errorMessage 
      });
    }
  }
} 