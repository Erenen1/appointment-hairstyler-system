import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
export * from './apiKeyMiddleware';
declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      email: string;
      userType: 'admin' | 'staff';
      fullName?: string;
    };
  }
}
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor');
    }
    (req as any).user = req.session.user;
    next();
  } catch (error) {
    next(error);
  }
};
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor');
    }
    if (req.session.user.userType !== 'admin') {
      throw ApiError.authorization('Bu işlem için admin yetkisi gerekiyor');
    }
    (req as any).user = req.session.user;
    next();
  } catch (error) {
    next(error);
  }
};
export const requireStaffOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor');
    }
    if (!['admin', 'staff'].includes(req.session.user.userType)) {
      throw ApiError.authorization('Bu işlem için personel veya admin yetkisi gerekiyor');
    }
    (req as any).user = req.session.user;
    next();
  } catch (error) {
    next(error);
  }
}; 