import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { JwtUtils, JwtPayload } from '../utils/jwtUtils';
import { config } from '../config/env';

// Request interface'ini genişlet
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      superAdmin?: boolean;
    }
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);
    
    // Token'ı doğrula
    const payload = JwtUtils.verifyToken(token);
    
    // User tipini kontrol et
    if (payload.userType !== 'admin') {
      throw ApiError.authorization('Bu işlem için admin yetkisi gerekiyor');
    }
    
    // Request'e user bilgisini ekle
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
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
    
    // Önce API key kontrolü yap
    if (apiKey) {
      if (apiKey === config.SUPER_ADMIN_API_KEY) {
        req.superAdmin = true;
        return next();
      } else {
        throw ApiError.authentication('Geçersiz API key');
      }
    }
    
    // API key yoksa JWT token kontrolü yap
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);
    
    // Token'ı doğrula
    const payload = JwtUtils.verifyToken(token);
    
    // User tipini kontrol et
    if (payload.userType !== 'admin') {
      throw ApiError.authorization('Bu işlem için admin yetkisi veya super admin API key\'i gerekiyor');
    }
    
    // Request'e user bilgisini ekle
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
