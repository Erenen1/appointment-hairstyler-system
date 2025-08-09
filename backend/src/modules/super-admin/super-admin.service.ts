import { ApiError, JwtUtils } from '../../utils';
import { config } from '../../config/env';
import db from '../../models';

/**
 * Super Admin authentication servisindeki işlemler
 */
class SuperAdminService {
  
  /**
   * Super Admin girişi (API key ile)
   */
  async loginWithApiKey(apiKey: string): Promise<{ token: string }> {
    try {
      // API key kontrolü
      if (!apiKey || apiKey !== config.SUPER_ADMIN_API_KEY) {
        throw ApiError.authentication('Geçersiz API key');
      }

      // Super admin token oluştur
      const payload = {
        businessId: 'super_admin',
        businessName: 'Super Admin',
        role: 'super_admin' as const
      };

      const token = JwtUtils.generateToken(payload);

      return { token };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Super Admin token doğrulama
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const payload = JwtUtils.verifyToken(token);
      return payload.role === 'super_admin' && payload.businessId === 'super_admin';
    } catch (error) {
      return false;
    }
  }

  /**
   * Tüm business'ları listeler
   */
  async getAllBusinesses(): Promise<any[]> {
    try {
      const businesses = await db.Business.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });
      
      return businesses.map((business: any) => business.toJSON());
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business detaylarını getirir
   */
  async getBusinessById(businessId: string): Promise<any> {
    try {
      const business = await db.Business.findByPk(businessId, {
        attributes: { exclude: ['password'] }
      });
      
      if (!business) {
        throw ApiError.notFound('İşletme bulunamadı');
      }

      // İstatistikleri de getir
      const [staffCount, serviceCount, appointmentCount, customerCount] = await Promise.all([
        db.Staff.count({ where: { businessId, isActive: true } }),
        db.Service.count({ where: { businessId, isActive: true } }),
        db.Appointment.count({ where: { businessId } }),
        db.Customer.count({ where: { businessId, isActive: true } })
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

  /**
   * Business'ı aktif/pasif yapar
   */
  async toggleBusinessStatus(businessId: string): Promise<any> {
    try {
      const business = await db.Business.findByPk(businessId);
      
      if (!business) {
        throw ApiError.notFound('İşletme bulunamadı');
      }

      const currentStatus = business.toJSON().isActive;
      await business.update({ isActive: !currentStatus });

      return business.toJSON();
    } catch (error) {
      throw error;
    }
  }
}

export default SuperAdminService; 