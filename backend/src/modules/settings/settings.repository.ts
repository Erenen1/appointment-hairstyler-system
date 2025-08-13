import { sequelize } from '../../config/database';
import { BusinessSettingsDTO, NotificationSettingsDTO, ProfileDTO } from './types/settings.types';

export class SettingsRepository {
  private get BusinessSettings() { return sequelize.models.SettingsBusinessSettings as any; }
  private get NotificationSettings() { return sequelize.models.SettingsNotificationSettings as any; }
  private get User() { return sequelize.models.AuthUser as any; }

  async getBusiness(tenantId: string) {
    const row = await this.BusinessSettings.findOne({ where: { tenant_id: tenantId } });
    return row ? row.toJSON() : null;
  }
  async upsertBusiness(tenantId: string, dto: BusinessSettingsDTO) {
    const existing = await this.BusinessSettings.findOne({ where: { tenant_id: tenantId } });
    if (!existing) {
      const created = await this.BusinessSettings.create({
        tenant_id: tenantId,
        business_name: dto.businessName,
        business_logo: dto.businessLogo,
        owner_name: dto.ownerName,
        email: dto.email,
        phone: dto.phone,
        address: dto.address,
        website: dto.website,
        description: dto.description,
        working_hours: dto.workingHours || {},
      });
      return created.toJSON();
    }
    await existing.update({
      business_name: dto.businessName ?? existing.business_name,
      business_logo: dto.businessLogo ?? existing.business_logo,
      owner_name: dto.ownerName ?? existing.owner_name,
      email: dto.email ?? existing.email,
      phone: dto.phone ?? existing.phone,
      address: dto.address ?? existing.address,
      website: dto.website ?? existing.website,
      description: dto.description ?? existing.description,
      working_hours: dto.workingHours ?? existing.working_hours,
    });
    return existing.toJSON();
  }

  async getNotification(tenantId: string) {
    const row = await this.NotificationSettings.findOne({ where: { tenant_id: tenantId } });
    return row ? row.toJSON() : null;
  }
  async upsertNotification(tenantId: string, dto: NotificationSettingsDTO) {
    const existing = await this.NotificationSettings.findOne({ where: { tenant_id: tenantId } });
    if (!existing) {
      const created = await this.NotificationSettings.create({ tenant_id: tenantId, ...{
        email_notifications: dto.emailNotifications,
        sms_notifications: dto.smsNotifications,
        appointment_reminders: dto.appointmentReminders,
        new_customer_alerts: dto.newCustomerAlerts,
        payment_alerts: dto.paymentAlerts,
      }});
      return created.toJSON();
    }
    await existing.update({
      email_notifications: dto.emailNotifications ?? existing.email_notifications,
      sms_notifications: dto.smsNotifications ?? existing.sms_notifications,
      appointment_reminders: dto.appointmentReminders ?? existing.appointment_reminders,
      new_customer_alerts: dto.newCustomerAlerts ?? existing.new_customer_alerts,
      payment_alerts: dto.paymentAlerts ?? existing.payment_alerts,
    });
    return existing.toJSON();
  }

  async getProfile(userId: string) {
    const row = await this.User.findByPk(userId, { attributes: ['id','username','email','first_name','last_name','phone','role','is_active','last_login','created_at','updated_at'] });
    return row ? row.toJSON() : null;
  }
  async updateProfile(userId: string, dto: ProfileDTO) {
    const existing = await this.User.findByPk(userId);
    if (!existing) return null;
    await existing.update({
      first_name: dto.fullName ? dto.fullName.split(' ')[0] : existing.first_name,
      last_name: dto.fullName ? dto.fullName.split(' ').slice(1).join(' ') : existing.last_name,
      email: dto.email ?? existing.email,
      phone: dto.phone ?? existing.phone,
    });
    return this.getProfile(userId);
  }
}

export default SettingsRepository;


