import { HashUtils, ApiError } from '../../utils';
import AdminRepository from './admin.repostory';
import { CreateAdminDto, UpdateAdminDto } from './dto';
import { IAdmin, IAdminResponse } from './admin.interface';

class AdminService {
    private adminRepository: AdminRepository;

    constructor(adminRepository: AdminRepository) {
        this.adminRepository = adminRepository;
    }

    /**
     * Admin nesnesinden hassas bilgileri çıkarır
     */
    private sanitizeAdmin(admin: IAdmin): IAdminResponse {
        const { password, ...sanitizedAdmin } = admin;
        return sanitizedAdmin as IAdminResponse;
    }

    /**
     * Yeni bir admin oluşturur
     */
    public async createAdmin(adminData: CreateAdminDto): Promise<IAdminResponse> {
        // Email kontrolü
        const existingAdmin = await this.adminRepository.findByEmail(adminData.email);
        if (existingAdmin) {
            throw ApiError.conflict('Bu e-posta adresi zaten kullanılıyor');
        }

        // Şifreyi hashle
        const hashedPassword = HashUtils.hashPassword(adminData.password);
        
        // Admin oluştur
        const admin = await this.adminRepository.create({
            ...adminData,
            password: hashedPassword
        });

        // Hassas bilgileri çıkar
        return this.sanitizeAdmin(admin);
    }

    /**
     * Tüm adminleri getirir
     */
    public async getAllAdmins(): Promise<IAdminResponse[]> {
        const admins = await this.adminRepository.findAll();
        return admins.map(admin => this.sanitizeAdmin(admin));
    }

    /**
     * ID'ye göre admin detaylarını getirir
     */
    public async getAdminById(id: string): Promise<IAdminResponse | null> {
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            return null;
        }
        
        return this.sanitizeAdmin(admin);
    }

    /**
     * Admin bilgilerini günceller
     */
    public async updateAdmin(id: string, updateData: UpdateAdminDto): Promise<IAdminResponse> {
        // Admin var mı kontrol et
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw ApiError.notFound('Admin bulunamadı');
        }

        // Email değiştirilmek isteniyorsa ve başka bir admin tarafından kullanılıyorsa hata ver
        if (updateData.email && updateData.email !== admin.email) {
            const existingAdmin = await this.adminRepository.findByEmail(updateData.email);
            if (existingAdmin && existingAdmin.id !== id) {
                throw ApiError.conflict('Bu e-posta adresi başka bir admin tarafından kullanılıyor');
            }
        }

        // Güncelle
        const updatedAdmin = await this.adminRepository.update(id, updateData);
        if (!updatedAdmin) {
            throw ApiError.internal('Admin güncellenirken bir hata oluştu');
        }
        
        // Hassas bilgileri çıkar
        return this.sanitizeAdmin(updatedAdmin);
    }

    /**
     * Admin şifresini değiştirir
     */
    public async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
        // Admin var mı kontrol et
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw ApiError.notFound('Admin bulunamadı');
        }

        // Mevcut şifre doğru mu kontrol et
        const isPasswordValid = HashUtils.verifyPassword(currentPassword, admin.password);
        if (!isPasswordValid) {
            throw ApiError.authentication('Mevcut şifre yanlış');
        }

        // Yeni şifreyi hashle
        const hashedPassword = HashUtils.hashPassword(newPassword);
        
        // Şifreyi güncelle
        await this.adminRepository.updatePassword(id, hashedPassword);
    }

    /**
     * Admin kaydını siler
     */
    public async deleteAdmin(id: string): Promise<void> {
        // Admin var mı kontrol et
        const admin = await this.adminRepository.findById(id);
        if (!admin) {
            throw ApiError.notFound('Admin bulunamadı');
        }

        // Sil
        await this.adminRepository.delete(id);
    }
}

export default AdminService;
