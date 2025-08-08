import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils';
import { JwtUtils, JwtPayload } from '../utils/jwtUtils';

// Request interface'ini genişlet
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      businessId?: string;
      isBusiness?: boolean;
      isAdmin?: boolean;
      isSuperAdmin?: boolean;
    }
  }
}

/**
 * Business token'ı doğrular ve business context'i ekler
 */
export const requireBusiness = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);
    
    // Token'ı doğrula
    const payload = JwtUtils.verifyToken(token);
    
    // Business tipini kontrol et
    if (payload.role !== 'business') {
      throw ApiError.authorization('Bu işlem için işletme girişi gerekiyor');
    }

    // Business ID kontrolü
    if (!payload.businessId || payload.businessId === 'super_admin') {
      throw ApiError.authorization('İşletme bilgisi bulunamadı');
    }
    
    // Request'e business bilgilerini ekle
    req.user = payload;
    req.businessId = payload.businessId;
    req.isBusiness = true;
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Admin token'ı doğrular ve admin context'i ekler
 */
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey || apiKey !== process.env.SUPER_ADMIN_API_KEY) {
      throw ApiError.authorization('Super admin API key bulunamadı veya geçersiz');
    }
    next();

  } catch (error) {
    next(error);
  }
}


export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);
    
    // Token'ı doğrula
    const payload = JwtUtils.verifyToken(token);
    
    // Super admin tipini kontrol et
    if (payload.role !== 'super_admin') {
      throw ApiError.authorization('Bu işlem için super admin yetkisi gerekiyor');
    }
    
    // Request'e admin bilgilerini ekle
    req.user = payload;
    req.businessId = payload.businessId; // Admin'in bağlı olduğu business
    req.isAdmin = true;
    
    // Super admin kontrolü
    if (payload.role === 'super_admin') {
      req.isSuperAdmin = true;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Business veya Admin token'ı kabul eder
 */
export const requireBusinessOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authorization header'dan token'ı al
    const authHeader = req.headers.authorization;
    const token = JwtUtils.extractTokenFromHeader(authHeader);
    
    // Token'ı doğrula
    const payload = JwtUtils.verifyToken(token);
    
    // Business veya Super Admin tipini kontrol et
    if (!['business', 'super_admin'].includes(payload.role)) {
      throw ApiError.authorization('Bu işlem için işletme veya super admin yetkisi gerekiyor');
    }
    
    // Request'e user bilgilerini ekle
    req.user = payload;
    req.businessId = payload.businessId;
    
    if (payload.role === 'business') {
      req.isBusiness = true;
    } else if (payload.role === 'super_admin') {
      req.isAdmin = true;
      req.isSuperAdmin = true;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Super admin yetkisi kontrol eder
//  */
// export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Authorization header'dan token'ı al
//     const authHeader = req.headers.authorization;
//     const token = JwtUtils.extractTokenFromHeader(authHeader);
    
//     // Token'ı doğrula
//     const payload = JwtUtils.verifyToken(token);
    
//     // Super admin kontrolü
//     if (payload.role !== 'super_admin') {
//       throw ApiError.authorization('Bu işlem için super admin yetkisi gerekiyor');
//     }
    
//     // Request'e super admin bilgilerini ekle
//     req.user = payload;
//     req.isAdmin = true;
//     req.isSuperAdmin = true;
    
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * Business context middleware - sorguları businessId ile filtreler
 */
export const applyBusinessContext = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Eğer super admin ise context uygulama
    if (req.isSuperAdmin) {
      return next();
    }

    // Business ID kontrolü
    if (!req.businessId) {
      throw ApiError.authorization('İşletme context\'i bulunamadı');
    }

    // Query parametrelerine businessId ekle (isteğe bağlı kullanım için)
    (req as any).businessContext = {
      businessId: req.businessId,
      filterBy: { businessId: req.businessId }
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Business sahibi kontrolü - sadece kendi işletmesine erişebilir
 */
export const requireBusinessOwner = (req: Request, res: Response, next: NextFunction) => {
  try {
    const targetBusinessId = req.params.businessId || req.body.businessId;
    
    // Super admin herkese erişebilir
    if (req.isSuperAdmin) {
      return next();
    }
    
    // Business owner sadece kendi işletmesine erişebilir
    if (req.isBusiness && req.businessId !== targetBusinessId) {
      throw ApiError.authorization('Sadece kendi işletmenize erişebilirsiniz');
    }
    
    // Business admin sadece kendi işletmesine erişebilir
    if (req.isAdmin && !req.isSuperAdmin && req.businessId !== targetBusinessId) {
      throw ApiError.authorization('Sadece kendi işletmenize erişebilirsiniz');
    }
    
    next();
  } catch (error) {
    next(error);
  }
}; 