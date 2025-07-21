import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiSuccess, ApiError } from '../../utils';
import BusinessAuthService from './business-auth.service';
import BusinessAuthRepository from './business-auth.repository';
import { 
  BusinessLoginDto, 
  BusinessRegisterDto, 
  BusinessUpdateDto, 
  BusinessChangePasswordDto 
} from './business-auth.interface';

/**
 * Business authentication HTTP isteklerini yöneten controller sınıfı
 */
class BusinessAuthController {
  private businessAuthService: BusinessAuthService;

  constructor() {
    const businessRepository = new BusinessAuthRepository();
    this.businessAuthService = new BusinessAuthService(businessRepository);
  }

  /**
   * Business kaydı oluşturur
   * POST /api/business-auth/register
   */
  public register: RequestHandler = async (req, res, next) => {
    try {
      const registerData: BusinessRegisterDto = req.body;

      // Gerekli alanları kontrol et
      if (!registerData.businessName || !registerData.ownerName || !registerData.email || !registerData.password) {
        throw ApiError.badRequest('İşletme adı, sahip adı, email ve şifre gereklidir');
      }

      // Email format kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        throw ApiError.badRequest('Geçerli bir email adresi giriniz');
      }

      // Şifre uzunluk kontrolü
      if (registerData.password.length < 6) {
        throw ApiError.badRequest('Şifre en az 6 karakter olmalıdır');
      }

      const result = await this.businessAuthService.register(registerData);

      res.status(201).json(
        ApiSuccess.created({
          business: result.business,
          token: result.token,
          message: 'İşletme hesabınız başarıyla oluşturuldu'
        }, 'Kayıt başarılı')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Business girişi
   * POST /api/business-auth/login
   */
  public login: RequestHandler = async (req, res, next) => {
    try {
      const loginData: BusinessLoginDto = req.body;

      // Gerekli alanları kontrol et
      if (!loginData.email || !loginData.password) {
        throw ApiError.badRequest('Email ve şifre gereklidir');
      }

      const result = await this.businessAuthService.login(loginData);

      res.json(
        ApiSuccess.item({
          business: result.business,
          token: result.token,
          message: 'Giriş başarılı'
        }, 'Giriş başarılı')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Business çıkışı
   * POST /api/business-auth/logout
   */
  public logout: RequestHandler = async (req, res, next) => {
    try {
      // JWT ile logout client-side işlemidir
      // İlerleye token blacklist eklenebilir
      res.json(
        ApiSuccess.message('Çıkış başarılı')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mevcut business bilgilerini getirir
   * GET /api/business-auth/me
   */
  public getProfile: RequestHandler = async (req, res, next) => {
    try {
      // Middleware'den gelen businessId
      const businessId = (req as any).user?.businessId;

      if (!businessId) {
        throw ApiError.badRequest('İşletme bilgisi bulunamadı');
      }

      const business = await this.businessAuthService.getProfile(businessId);

      res.json(
        ApiSuccess.item(business, 'Profil bilgileri başarıyla getirildi')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Business profil bilgilerini günceller
   * PUT /api/business-auth/me
   */
  public updateProfile: RequestHandler = async (req, res, next) => {
    try {
      const businessId = (req as any).user?.businessId;
      const updateData: BusinessUpdateDto = req.body;

      if (!businessId) {
        throw ApiError.badRequest('İşletme bilgisi bulunamadı');
      }

      const updatedBusiness = await this.businessAuthService.updateProfile(businessId, updateData);

      res.json(
        ApiSuccess.updated(updatedBusiness, 'Profil başarıyla güncellendi')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Business şifresini değiştirir
   * PUT /api/business-auth/change-password
   */
  public changePassword: RequestHandler = async (req, res, next) => {
    try {
      const businessId = (req as any).user?.businessId;
      const passwordData: BusinessChangePasswordDto = req.body;

      if (!businessId) {
        throw ApiError.badRequest('İşletme bilgisi bulunamadı');
      }

      // Gerekli alanları kontrol et
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        throw ApiError.badRequest('Mevcut şifre ve yeni şifre gereklidir');
      }

      // Yeni şifre uzunluk kontrolü
      if (passwordData.newPassword.length < 6) {
        throw ApiError.badRequest('Yeni şifre en az 6 karakter olmalıdır');
      }

      await this.businessAuthService.changePassword(businessId, passwordData);

      res.json(
        ApiSuccess.message('Şifre başarıyla değiştirildi')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Business dashboard verilerini getirir
   * GET /api/business-auth/dashboard
   */
  public getDashboard: RequestHandler = async (req, res, next) => {
    try {
      const businessId = (req as any).user?.businessId;

      if (!businessId) {
        throw ApiError.badRequest('İşletme bilgisi bulunamadı');
      }

      const dashboard = await this.businessAuthService.getDashboard(businessId);

      res.json(
        ApiSuccess.item(dashboard, 'Dashboard verileri başarıyla getirildi')
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Token doğrulama
   * GET /api/business-auth/verify
   */
  public verifyToken: RequestHandler = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ApiError.authentication('Token bulunamadı');
      }

      const token = authHeader.substring(7);
      const business = await this.businessAuthService.verifyToken(token);

      res.json(
        ApiSuccess.item(business, 'Token geçerli')
      );
    } catch (error) {
      next(error);
    }
  };
}

export default BusinessAuthController; 