import { RequestHandler } from 'express';
import { ApiSuccess, ApiError } from '../../utils';
import SuperAdminService from './super-admin.service';

/**
 * Super Admin HTTP isteklerini yöneten controller sınıfı
 */
class SuperAdminController {
  private superAdminService: SuperAdminService;

  constructor() {
    this.superAdminService = new SuperAdminService();
  }

  /**
   * Super Admin girişi (API key ile)
   * POST /api/super-admin/login
   */
  public login: RequestHandler = async (req, res, next) => {
    try {
      const { apiKey } = req.body;

      if (!apiKey) {
        throw ApiError.badRequest('API key gereklidir');
      }

      const result = await this.superAdminService.loginWithApiKey(apiKey);

      res.json(
        ApiSuccess.item({
          token: result.token,
          role: 'super_admin',
          message: 'Super admin girişi başarılı'
        }, 'Giriş başarılı')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Super Admin profil bilgileri
   * GET /api/super-admin/me
   */
  public getProfile: RequestHandler = async (req, res, next) => {
    try {
      res.json(
        ApiSuccess.item({
          businessId: 'super_admin',
          businessName: 'Super Admin',
          role: 'super_admin',
          permissions: ['manage_all_businesses', 'view_all_data', 'admin_panel']
        }, 'Super admin profil bilgileri')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Token doğrulama
   * GET /api/super-admin/verify
   */
  public verifyToken: RequestHandler = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ApiError.authentication('Token bulunamadı');
      }

      const token = authHeader.substring(7);
      const isValid = await this.superAdminService.verifyToken(token);

      if (!isValid) {
        throw ApiError.authentication('Geçersiz token');
      }

      res.json(
        ApiSuccess.item({ valid: true }, 'Token geçerli')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Tüm business'ları listeler
   * GET /api/super-admin/businesses
   */
  public getBusinesses: RequestHandler = async (req, res, next) => {
    try {
      const businesses = await this.superAdminService.getAllBusinesses();

      res.json(
        ApiSuccess.list(businesses, undefined, 'Business listesi başarıyla getirildi')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Business detaylarını getirir
   * GET /api/super-admin/businesses/:id
   */
  public getBusinessById: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const business = await this.superAdminService.getBusinessById(id);

      res.json(
        ApiSuccess.item(business, 'Business detayları başarıyla getirildi')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Business durumunu değiştirir
   * PUT /api/super-admin/businesses/:id/toggle-status
   */
  public toggleBusinessStatus: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const business = await this.superAdminService.toggleBusinessStatus(id);

      res.json(
        ApiSuccess.updated(business, 'Business durumu başarıyla güncellendi')
      );
    } catch (error) {
      next(error);
    }
  };
}

export default SuperAdminController; 