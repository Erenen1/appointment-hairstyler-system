import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwtUtils';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
  user?: {
    userId?: string;
    tenantId?: string;
    username?: string;
    role: string;
  };
}

export const requireAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = JwtUtils.extractTokenFromHeader(req.headers.authorization);
  const payload = JwtUtils.verifyToken(token);
  if (!payload.role) throw ApiError.authentication('Yetkisiz');
  req.user = {
    userId: payload.userId,
    tenantId: payload.tenantId,
    username: payload.username,
    role: payload.role,
  };
  next();
};


