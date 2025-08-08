import { ApiError, HashUtils, JwtUtils } from '../../utils';
import BusinessAuthRepository from './business-auth.repository';
import {
  IBusiness,
  IBusinessResponse,
  BusinessLoginDto,
  BusinessRegisterDto,
  BusinessUpdateDto,
  BusinessChangePasswordDto,
  BusinessJwtPayload
} from './business-auth.interface';

/**
 * Business authentication iş mantığını yöneten service sınıfı
 */
class BusinessAuthService {
  private businessRepository: BusinessAuthRepository;

  constructor(businessRepository: BusinessAuthRepository) {
    this.businessRepository = businessRepository;
  }

  /**
   * Business nesnesinden hassas bilgileri çıkarır
   */
  private sanitizeBusiness(business: IBusiness): IBusinessResponse {
    const { password, deletedAt, ...sanitizedBusiness } = business;
    return sanitizedBusiness as IBusinessResponse;
  }

  /**
   * JWT token oluşturur
   */
  private generateToken(business: IBusiness): string {
    const payload = {
      businessId: business.id,
      businessName: business.businessName,
      role: 'business' as const
    };
    return JwtUtils.generateToken(payload);
  }

  /**
   * Yeni business kaydı oluşturur
   */
  async register(registerData: BusinessRegisterDto): Promise<{ business: IBusinessResponse; }> {
    try {
      const existingBusiness = await this.businessRepository.findByEmail(registerData.email);
      if (existingBusiness) {
        throw ApiError.conflict('Bu email adresi zaten kullanılıyor');
      }

      const hashedPassword = HashUtils.hashPassword(registerData.password);

      const business = await this.businessRepository.createBusiness({
        ...registerData,
        password: hashedPassword,
        isActive: true,
      });

      return {
        business: this.sanitizeBusiness(business),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business girişi
   */
  async login(loginData: BusinessLoginDto): Promise<{
    business: IBusinessResponse;
    token: string;
  }> {
    try {
      const business = await this.businessRepository.findByEmail(loginData.email);
      if (!business) {
        throw ApiError.authentication('Email veya şifre hatalı');
      }

      const isPasswordValid = HashUtils.verifyPassword(loginData.password, business.password);
      if (!isPasswordValid) {
        throw ApiError.authentication('Email veya şifre hatalı');
      }

      if (!business.isActive) {
        throw ApiError.authentication('İşletme hesabınız aktif değil');
      }

      await this.businessRepository.updateLastLogin(business.id);

      const token = this.generateToken(business);

      return {
        business: this.sanitizeBusiness(business),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business profil bilgilerini getirir
   */
  async getProfile(businessId: string): Promise<IBusinessResponse> {
    try {
      const business = await this.businessRepository.findById(businessId);
      if (!business) {
        throw ApiError.notFound('İşletme bulunamadı');
      }

      return this.sanitizeBusiness(business);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business profil bilgilerini günceller
   */
  async updateProfile(businessId: string, updateData: BusinessUpdateDto): Promise<IBusinessResponse> {
    try {
      const updatedBusiness = await this.businessRepository.updateBusiness(businessId, updateData);
      if (!updatedBusiness) {
        throw ApiError.notFound('İşletme bulunamadı');
      }

      return this.sanitizeBusiness(updatedBusiness);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business şifresini değiştirir
   */
  async changePassword(businessId: string, passwordData: BusinessChangePasswordDto): Promise<void> {
    try {
      // Business'ı bul
      const business = await this.businessRepository.findById(businessId);
      if (!business) {
        throw ApiError.notFound('İşletme bulunamadı');
      }

      // Mevcut şifre kontrolü
      const isCurrentPasswordValid = HashUtils.verifyPassword(
        passwordData.currentPassword,
        business.password
      );
      if (!isCurrentPasswordValid) {
        throw ApiError.authentication('Mevcut şifre yanlış');
      }

      // Yeni şifreyi hashle
      const hashedNewPassword = HashUtils.hashPassword(passwordData.newPassword);

      // Şifreyi güncelle
      const updated = await this.businessRepository.updatePassword(businessId, hashedNewPassword);
      if (!updated) {
        throw ApiError.internal('Şifre güncellenirken bir hata oluştu');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Business dashboard verilerini getirir
   */
  async getDashboard(businessId: string): Promise<any> {
    try {
      const businessSummary = await this.businessRepository.getBusinessSummary(businessId);
      if (!businessSummary) {
        throw ApiError.notFound('İşletme bulunamadı');
      }

      return businessSummary;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Token'dan business bilgilerini çıkarır ve kontrol eder
   */
  async verifyToken(token: string): Promise<IBusinessResponse> {
    try {
      // Token'ı doğrula
      const payload = JwtUtils.verifyToken(token);

      if (payload.role !== 'business') {
        throw ApiError.authentication('Geçersiz token tipi');
      }

      // Business'ın hala aktif olduğunu kontrol et
      const business = await this.businessRepository.findById(payload.businessId);
      if (!business || !business.isActive) {
        throw ApiError.authentication('İşletme hesabı aktif değil');
      }

      return this.sanitizeBusiness(business);
    } catch (error) {
      throw error;
    }
  }
}

export default BusinessAuthService; 