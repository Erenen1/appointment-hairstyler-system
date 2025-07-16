import AuthService from "./auth.service";
import { LoginAuthDTO } from "./dto/login-auth-dto";
import { NextFunction, Request, Response } from "express";
import { ApiSuccess } from "../../utils/ApiResponse";

/**
 * Kimlik doğrulama işlemleri için controller sınıfı
 */
class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    /**
     * Kullanıcı girişi yapar ve JWT token döndürür
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const loginDto: LoginAuthDTO = req.body;
            let loginResponse = await this.authService.login(loginDto);
            res.status(200).json(ApiSuccess.item(loginResponse, 'Giriş başarılı'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Kullanıcı profil bilgilerini getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.user.id;
            const profile = await this.authService.getProfile(id);
            res.status(200).json(ApiSuccess.item(profile, 'Profil bilgileri başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;