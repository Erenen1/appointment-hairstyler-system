import { IAuth } from "./auth.interface";
import { BaseRepository } from "../common/base.repository";
import db from "../../models/index";
import { ProfileResponseDTO } from "./dto/profile-dto";

const { Admin } = db;

/**
 * Auth işlemleri için repository sınıfı
 */
class AuthRepository extends BaseRepository<IAuth> {
    constructor() {
        super(Admin);
    }

    /**
     * E-posta adresine göre kullanıcı arar
     * @param email Aranacak e-posta adresi
     * @returns Bulunan kullanıcı veya null
     */
    public async findByEmail(email: string): Promise<IAuth | null> {
        return await this.findOne({ email });
    }

    /**
     * Kullanıcının son giriş tarihini günceller
     * @param id Kullanıcı ID
     */
    public async updateLastLogin(id: string): Promise<void> {
        await this.update(id, { lastLogin: new Date() });
    }

    /**
     * Kullanıcı profilini getirir
     * @param id Kullanıcı ID
     * @returns Kullanıcı profil bilgileri
     */
    public async getProfile(id: string): Promise<ProfileResponseDTO | null> {
        return await this.findOne({ where: { id } });
    }
}

export default AuthRepository;