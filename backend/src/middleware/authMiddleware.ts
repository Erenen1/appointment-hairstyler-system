import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { config } from '../config/env';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if(!req.session.user){
    throw ApiError.authentication('Oturum açmanız gerekiyor');
  }
  if(req.session.user.userType !== 'admin'){
    throw ApiError.authorization('Bu işlem için admin yetkisi gerekiyor');
  }
  next();
};

export const requireSuperAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
      throw ApiError.authentication('X-API-KEY header\'ı eksik');
    }
    if (apiKey !== config.SUPER_ADMIN_API_KEY) {
      throw ApiError.authentication('Geçersiz API key');
    }
    req.superAdmin = true;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdminOrSuperApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey) {
      if (apiKey === config.SUPER_ADMIN_API_KEY) {
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
