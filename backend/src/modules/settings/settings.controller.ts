import { Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import SettingsService from './settings.service';
import { AuthRequest } from '../../middleware/auth';

export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  getBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.getBusiness(req.user?.tenantId as string); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  upsertBusiness = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.upsertBusiness(req.user?.tenantId as string, req.body); res.json(ApiSuccess.updated(data)); } catch (err) { next(err); }
  };

  getNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.getNotification(req.user?.tenantId as string); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  upsertNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.upsertNotification(req.user?.tenantId as string, req.body); res.json(ApiSuccess.updated(data)); } catch (err) { next(err); }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.getProfile(req.user?.userId as string); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.updateProfile(req.user?.userId as string, req.body); res.json(ApiSuccess.updated(data)); } catch (err) { next(err); }
  };
}

export default SettingsController;


