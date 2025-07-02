import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import Env from '../config/env';
declare global {
  namespace Express {
    interface Request {
      superAdmin?: boolean;
    }
  }
}
export const requireSuperAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      throw ApiError.authentication('X-API-KEY header\'ı eksik');
    }
    if (apiKey !== Env.SUPER_ADMIN_API_KEY) {
      throw ApiError.authentication('Geçersiz API key');
    }
    req.superAdmin = true;
    next();
  } catch (error) {
    next(error);
  }
};
export const optionalApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey) {
      if (apiKey === Env.SUPER_ADMIN_API_KEY) {
        req.superAdmin = true;
      } else {
        throw ApiError.authentication('Geçersiz API key');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
export const requireAuthOrApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey) {
      if (apiKey === Env.SUPER_ADMIN_API_KEY) {
        req.superAdmin = true;
        return next();
      } else {
        throw ApiError.authentication('Geçersiz API key');
      }
    }
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor veya geçerli bir API key sağlamanız gerekiyor');
    }
    (req as any).user = req.session.user;
    next();
  } catch (error) {
    next(error);
  }
};
export const requireAdminOrSuperApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey) {
      if (apiKey === Env.SUPER_ADMIN_API_KEY) {
        req.superAdmin = true;
        return next();
      } else {
        throw ApiError.authentication('Geçersiz API key');
      }
    }
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor veya geçerli bir API key sağlamanız gerekiyor');
    }
    if (req.session.user.userType !== 'admin') {
      throw ApiError.authorization('Bu işlem için admin yetkisi veya super admin API key\'i gerekiyor');
    }
    (req as any).user = req.session.user;
    next();
  } catch (error) {
    next(error);
  }
}; 