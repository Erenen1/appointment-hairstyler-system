import SettingsRepository from './settings.repository';
import { BusinessSettingsDTO, NotificationSettingsDTO, ProfileDTO } from './types/settings.types';

export class SettingsService {
  constructor(private readonly repo: SettingsRepository) {}
  getBusiness(tenantId: string) { return this.repo.getBusiness(tenantId); }
  upsertBusiness(tenantId: string, dto: BusinessSettingsDTO) { return this.repo.upsertBusiness(tenantId, dto); }
  getNotification(tenantId: string) { return this.repo.getNotification(tenantId); }
  upsertNotification(tenantId: string, dto: NotificationSettingsDTO) { return this.repo.upsertNotification(tenantId, dto); }
  getProfile(userId: string) { return this.repo.getProfile(userId); }
  updateProfile(userId: string, dto: ProfileDTO) { return this.repo.updateProfile(userId, dto); }
}

export default SettingsService;


