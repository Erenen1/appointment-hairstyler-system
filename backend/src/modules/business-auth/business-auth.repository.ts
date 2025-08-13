import { sequelize } from '../../config/database';
import { IBusiness } from './business-auth.interface';

/**
 * Business veritabanı işlemlerini yöneten repository sınıfı
 */
class BusinessAuthRepository {
  private get model() { return (sequelize.models as any).SettingsBusinessSettings; }

  async findById(id: string): Promise<IBusiness | null> {
    const row = await this.model.findByPk(id);
    return row ? (row.toJSON() as IBusiness) : null;
  }

  /**
   * Email'e göre business bulur
   */
  async findByEmail(email: string): Promise<IBusiness | null> {
    try {
      const business = await this.model.findOne({
        where: { 
          email, 
          deletedAt: null,
          isActive: true 
        }
      });
      return business?.toJSON() || null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business oluşturur
   */
  async createBusiness(businessData: Partial<IBusiness>): Promise<IBusiness> {
    try {
      const business = await this.model.create(businessData);
      return business.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business günceller
   */
  async updateBusiness(id: string, updateData: Partial<IBusiness>): Promise<IBusiness | null> {
    try {
      const business = await this.model.findByPk(id);
      if (!business) {
        return null;
      }
      
      await business.update(updateData);
      return business.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Son giriş zamanını günceller
   */
  async updateLastLogin(id: string): Promise<boolean> {
    try {
      const [affectedRows] = await this.model.update(
        { lastLogin: new Date() },
        { where: { id } }
      );
      return affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business'ı aktif/pasif yapar
   */
  async toggleActiveStatus(id: string): Promise<IBusiness | null> {
    try {
      const business = await this.model.findByPk(id);
      if (!business) {
        return null;
      }
      
      const currentStatus = business.toJSON().isActive;
      await business.update({ isActive: !currentStatus });
      return business.toJSON();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business şifresini günceller
   */
  async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
    try {
      const [affectedRows] = await this.model.update(
        { password: hashedPassword },
        { where: { id } }
      );
      return affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business'ın verilerini özet olarak getirir (istatistiklerle birlikte)
   */
  async getBusinessSummary(id: string): Promise<any> {
    try {
      const business = await this.model.findOne({
        where: { id, isActive: true },
        attributes: {
          exclude: ['password', 'deletedAt']
        }
      });

      if (!business) {
        return null;
      }

      // Business'a ait temel istatistikler
      const Staff = (sequelize.models as any).ScheduleStaff;
      const Service = (sequelize.models as any).ScheduleService;
      const Appointment = (sequelize.models as any).ScheduleAppointment;
      const Customer = (sequelize.models as any).CrmCustomer;
      const [staffCount, serviceCount, appointmentCount, customerCount] = await Promise.all([
        Staff.count({ where: { tenant_id: business.tenant_id, is_active: true } }),
        Service.count({ where: { tenant_id: business.tenant_id } }),
        Appointment.count({ where: { tenant_id: business.tenant_id } }),
        Customer.count({ where: { tenant_id: business.tenant_id, is_active: true } })
      ]);

      return {
        ...business.toJSON(),
        stats: {
          staffCount,
          serviceCount,
          appointmentCount,
          customerCount
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export default BusinessAuthRepository; 