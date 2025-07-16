import { config } from '../config/env';
import { ApiError } from './ApiError';
import jwt, { SignOptions } from "jsonwebtoken"

export interface JwtPayload {
  id: string;
  email: string;
  fullName: string;
  userType?: string;
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