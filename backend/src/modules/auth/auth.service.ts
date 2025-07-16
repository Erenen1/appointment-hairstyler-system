import AuthRepository from "./auth.repository";
import { LoginAuthDTO, LoginAuthResponseDTO } from "./dto/login-auth-dto";
import { ApiError } from "../../utils/ApiError";
import { HashUtils } from "../../utils/hashUtils";
import { JwtUtils } from "../../utils/jwtUtils";
import { ProfileResponseDTO } from "./dto/profile-dto";

/**
 * Kimlik doğrulama işlemleri için servis sınıfı
 */
class AuthService {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }
    
    /**
     * Kullanıcı girişi yapar ve JWT token döndürür
     * @param loginDto Giriş bilgileri
     * @returns JWT token ve kullanıcı bilgileri
     */
    public async login(loginDto: LoginAuthDTO): Promise<LoginAuthResponseDTO> {
        // E-posta adresine göre kullanıcıyı bul
        const admin = await this.authRepository.findByEmail(loginDto.email);
        if (!admin) {
            throw ApiError.notFound('Bu e-posta adresiyle kayıtlı bir hesap bulunamadı');
        }

        // Şifre kontrolü
        const isPasswordValid = HashUtils.verifyPassword(loginDto.password, admin.password);
        if (!isPasswordValid) {
            throw ApiError.badRequest('Şifre veya e-posta adresi yanlış');
        }

        // JWT için payload hazırla
        const payload = {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            userType: "admin",
        };

        // Token oluştur
        const token = JwtUtils.generateToken(payload);

        // Son giriş tarihini güncelle
        await this.authRepository.updateLastLogin(admin.id);
        // Yanıt nesnesini oluştur
        const response: LoginAuthResponseDTO = {
            bearerAuth: token,
            user: {
                id: admin.id,
                email: admin.email,
                fullName: admin.fullName,
                userType: admin.userType,
                phone: admin.phone,
                isActive: admin.isActive,
                lastLogin: admin.lastLogin,
            }
        };

        return response;
    }

    /**
     * Kullanıcı profilini getirir
     * @param id Kullanıcı ID
     * @returns Kullanıcı profil bilgileri
     */
    public async getProfile(id: string): Promise<ProfileResponseDTO> {
        const profile = await this.authRepository.getProfile(id);
        if (!profile) {
            throw ApiError.notFound('Kullanıcı profili bulunamadı');
        }
        delete profile.password;
        return profile;
    }
}

export default AuthService;