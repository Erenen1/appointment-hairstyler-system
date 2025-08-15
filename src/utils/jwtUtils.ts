import { config } from '../config/env';
import { ApiError } from './ApiError';
import jwt, { SignOptions } from "jsonwebtoken"

export interface JwtPayload {
  // Business için
  businessId?: string;
  businessName?: string;
  // Kullanıcı (auth.users) için
  userId?: string;
  username?: string;
  // Rol genişletildi
  role: 'business' | 'super_admin' | 'admin' | 'staff' | 'user';
  exp?: number;
  iat?: number;
}

export class JwtUtils {

  static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    try {
      const options: SignOptions = {
        expiresIn: (config.JWT_EXPIRES_IN || '24h') as any,
        issuer: 'kuafor-system',
        audience: 'kuafor-admin'
      };
      return jwt.sign(payload, config.JWT_SECRET, options);
    } catch (error) {
      throw ApiError.internal('Token oluşturulurken hata oluştu');
    }
  }

  static generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    try {
      const options: SignOptions = {
        expiresIn: (config.JWT_REFRESH_EXPIRES_IN || '7d') as any,
        issuer: 'kuafor-system',
        audience: 'kuafor-admin-refresh'
      };
      return jwt.sign(payload, config.JWT_SECRET, options);
    } catch (error) {
      throw ApiError.internal('Refresh token oluşturulurken hata oluştu');
    }
  }

  /**
   * JWT token'ı doğrular ve payload'ı döner
   */
  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET, {
        issuer: 'kuafor-system',
        audience: 'kuafor-admin'
      }) as JwtPayload;
      
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.authentication('Token süresi dolmuş');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.authentication('Geçersiz token');
      }
      throw ApiError.authentication('Token doğrulanamadı');
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET, {
        issuer: 'kuafor-system',
        audience: 'kuafor-admin-refresh'
      }) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.authentication('Refresh token süresi dolmuş');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.authentication('Geçersiz refresh token');
      }
      throw ApiError.authentication('Refresh token doğrulanamadı');
    }
  }

  static generatePasswordResetToken(payload: { userId: string; email: string }): string {
    try {
      const options: SignOptions = {
        expiresIn: (config.PASSWORD_RESET_EXPIRES_IN || '15m') as any,
        issuer: 'kuafor-system',
        audience: 'kuafor-password-reset'
      };
      return jwt.sign(payload, config.JWT_SECRET, options);
    } catch (error) {
      throw ApiError.internal('Parola sıfırlama tokeni oluşturulurken hata oluştu');
    }
  }

  static verifyPasswordResetToken(token: string): { userId: string; email: string } {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET, {
        issuer: 'kuafor-system',
        audience: 'kuafor-password-reset'
      }) as any;
      return { userId: decoded.userId, email: decoded.email };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ApiError.authentication('Parola sıfırlama tokeninin süresi dolmuş');
      }
      throw ApiError.authentication('Parola sıfırlama tokeni geçersiz');
    }
  }

  /**
   * Authorization header'dan token'ı çıkarır
   */
  static extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader) {
      throw ApiError.authentication('Authorization header bulunamadı');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw ApiError.authentication('Geçersiz authorization format. Bearer token bekleniyor.');
    }

    const token = authHeader.substring(7); // "Bearer " kısmını çıkar
    if (!token) {
      throw ApiError.authentication('Token bulunamadı');
    }

    return token;
  }

  /**
   * Token'ın geçerliliğini kontrol eder (expiry kontrolü)
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
} 