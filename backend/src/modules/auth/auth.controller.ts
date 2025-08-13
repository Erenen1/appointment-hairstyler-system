import { Request, Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import AuthService from './auth.service';
import { LoginDto, RegisterDto } from './types/auth.types';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw ApiError.badRequest('x-tenant-id header zorunlu');
      const dto = req.body as LoginDto;
      const result = await this.service.login(tenantId, dto);
      res.json(ApiSuccess.item({
        user: result.user,
        token: result.token,
        refreshToken: result.refreshToken,
      }, 'Giriş başarılı'));
    } catch (err) {
      next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw ApiError.badRequest('x-tenant-id header zorunlu');
      const dto = req.body as RegisterDto;
      const result = await this.service.register(tenantId, dto);
      res.status(201).json(ApiSuccess.created({ user: result.user, token: result.token, refreshToken: result.refreshToken }));
    } catch (err) { next(err); }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body as { refreshToken: string };
      if (!refreshToken) throw ApiError.badRequest('refreshToken gerekli');
      const result = await this.service.refresh(refreshToken);
      res.json(ApiSuccess.item(result, 'Token yenilendi'));
    } catch (err) { next(err); }
  };

  logout = async (_req: Request, res: Response) => {
    // JWT temelli sistemde logout client taraflıdır; opsiyonel blacklist ileride
    res.status(204).send();
  };

  requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      if (!tenantId) throw ApiError.badRequest('x-tenant-id header zorunlu');
      const { email } = req.body as { email: string };
      if (!email) throw ApiError.badRequest('email gerekli');
      const result = await this.service.requestPasswordReset(tenantId, email);
      res.json(ApiSuccess.item(result, 'Parola sıfırlama isteği alındı'));
    } catch (err) { next(err); }
  };

  confirmPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body as { token: string; newPassword: string };
      if (!token || !newPassword) throw ApiError.badRequest('token ve newPassword gerekli');
      await this.service.confirmPasswordReset(token, newPassword);
      res.json(ApiSuccess.message('Parola güncellendi'));
    } catch (err) { next(err); }
  };
}

export default AuthController;


