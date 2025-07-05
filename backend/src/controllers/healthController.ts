import { Request, Response, NextFunction } from 'express';
import { ApiSuccess, ApiError } from '../utils';
import { healthCheck } from '../config/database';
import Enum  from '../config/env';
import logger from '../config/logger';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Bilinmeyen hata';
};

export class HealthController {
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
        res.status(200).json(ApiSuccess.item(systemHealth, 'Sistem sağlıklı çalışıyorr'));
      } else {
        throw ApiError.internal('Sistem sağlık kontrolünde sorun tespit edildi');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logger.error('System health check failed', { error: errorMessage });
      next(error);
    }
  }

  static async getDatabaseHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = await healthCheck();
      if (health.status === 'healthy') {
        res.json(ApiSuccess.item(health, 'Database bağlantısı sağlıklı'));
      } else {
        throw ApiError.database('Database bağlantısında sorun var');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logger.error('Database health check failed', { error: errorMessage });
      next(error);
    }
  }

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
      res.json(ApiSuccess.item(serverInfo, 'Server bilgileri getirildi'));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logger.error('Server info failed', { error: errorMessage });
      next(error);
    }
  }

  static async liveness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  }

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
        throw ApiError.internal('Database is not ready');
      }
    } catch (error) {
      next(error);
    }
  }
}