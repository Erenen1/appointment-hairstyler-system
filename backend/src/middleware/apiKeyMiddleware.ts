import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import Env from '../config/env';

// Request interface'ini extend ediyoruz
declare global {
  namespace Express {
    interface Request {
      superAdmin?: boolean;
    }
  }
}

/**
 * Super admin API key doğrulaması
 * X-API-KEY header'ını kontrol eder
 */
export const requireSuperAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    // X-API-KEY header'ını al
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      throw ApiError.authentication('X-API-KEY header\'ı eksik');
    }

    // API key'i doğrula
    if (apiKey !== Env.SUPER_ADMIN_API_KEY) {
      throw ApiError.authentication('Geçersiz API key');
    }

    // Super admin flag'ini set et
    req.superAdmin = true;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Opsiyonel API key doğrulaması
 * API key varsa doğrular, yoksa normal işleme devam eder
 */
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

/**
 * Session auth veya API key ile doğrulama
 * Hem session hem de API key kontrolü yapar
 */
export const requireAuthOrApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Önce API key kontrol et
    const apiKey = req.headers['x-api-key'] as string;
    
    if (apiKey) {
      if (apiKey === Env.SUPER_ADMIN_API_KEY) {
        req.superAdmin = true;
        return next();
      } else {
        throw ApiError.authentication('Geçersiz API key');
      }
    }
    
    // API key yoksa session kontrolü yap
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor veya geçerli bir API key sağlamanız gerekiyor');
    }

    // Kullanıcı bilgilerini req.user'a ekle
    (req as any).user = req.session.user;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Admin session veya super admin API key kontrolü
 */
export const requireAdminOrSuperApiKey = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Önce API key kontrol et
    const apiKey = req.headers['x-api-key'] as string;
    
    if (apiKey) {
      if (apiKey === Env.SUPER_ADMIN_API_KEY) {
        req.superAdmin = true;
        return next();
      } else {
        throw ApiError.authentication('Geçersiz API key');
      }
    }
    
    // API key yoksa admin session kontrolü yap
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor veya geçerli bir API key sağlamanız gerekiyor');
    }

    if (req.session.user.userType !== 'admin') {
      throw ApiError.authorization('Bu işlem için admin yetkisi veya super admin API key\'i gerekiyor');
    }

    // Kullanıcı bilgilerini req.user'a ekle
    (req as any).user = req.session.user;
    
    next();
  } catch (error) {
    next(error);
  }
}; 