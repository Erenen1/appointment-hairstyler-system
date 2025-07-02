import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

// API Key middleware'lerini import et
export * from './apiKeyMiddleware';

// Session için user bilgilerini extend ediyoruz
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
    // Session kontrolü
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor');
    }

    // Kullanıcı bilgilerini req.user'a ekle
    (req as any).user = req.session.user;
    
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Önce auth kontrolü
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor');
    }

    // Admin kontrolü
    if (req.session.user.userType !== 'admin') {
      throw ApiError.authorization('Bu işlem için admin yetkisi gerekiyor');
    }

    // Kullanıcı bilgilerini req.user'a ekle
    (req as any).user = req.session.user;
    
    next();
  } catch (error) {
    next(error);
  }
};

export const requireStaffOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Önce auth kontrolü
    if (!req.session.user) {
      throw ApiError.authentication('Oturum açmanız gerekiyor');
    }

    // Staff veya admin kontrolü
    if (!['admin', 'staff'].includes(req.session.user.userType)) {
      throw ApiError.authorization('Bu işlem için personel veya admin yetkisi gerekiyor');
    }

    // Kullanıcı bilgilerini req.user'a ekle
    (req as any).user = req.session.user;
    
    next();
  } catch (error) {
    next(error);
  }
}; 