import { ApiError } from "../../utils/ApiError";
import StaffRepository from "./staff.repository";
import { StaffCreateDTO, StaffUpdateDTO } from "./dto";
import { IStaff } from "./staff.interface";
import path from "path";
import { generateFileUrl, deleteFile } from "../../config/multer";

/**
 * Personel işlemleri için servis sınıfı
 */
class StaffService {
    private staffRepository: StaffRepository;

    constructor(staffRepository: StaffRepository) {
        this.staffRepository = staffRepository;
    }

    /**
     * Tüm personelleri getirir
     * @param isActive Aktiflik durumu filtresi (opsiyonel)
     * @returns Personel listesi
     */
    public async getAllStaff(isActive?: boolean): Promise<IStaff[]> {
        return await this.staffRepository.getAllStaff(isActive);
    }

    /**
     * ID'ye göre personel getirir
     * @param id Personel ID
     * @returns Personel bilgileri
     */
    public async getStaffById(id: string): Promise<IStaff> {
        const staff = await this.staffRepository.getStaffById(id);
        if (!staff) {
            throw ApiError.notFound('Personel bulunamadı');
        }
        return staff;
    }

    /**
     * Yeni personel oluşturur
     * @param staffDto Personel bilgileri
     * @param file Yüklenen avatar dosyası
     * @param req Express isteği
     * @returns Oluşturulan personel
     */
    public async createStaff(staffDto: StaffCreateDTO, file: Express.Multer.File | undefined, req: any): Promise<IStaff> {
        // E-posta kontrolü
        const existingStaff = await this.staffRepository.findByEmail(staffDto.email);
        if (existingStaff) {
            throw ApiError.conflict('Bu email adresi ile kayıtlı personel zaten mevcut');
        }

        // Avatar dosyası yüklendi mi kontrol et
        let avatarPath = null;
        if (file) {
            const fileName = file.filename;
            avatarPath = generateFileUrl(req, path.join('profiles', fileName));
        }

        // Personel oluştur
        const staff = await this.staffRepository.createStaff({
            fullName: staffDto.fullName,
            email: staffDto.email,
            phone: staffDto.phone,
            specialties: staffDto.specialties,
            avatar: avatarPath,
            isActive: true,
        });
        if(staffDto.serviceIds && typeof staffDto.serviceIds === 'string'){
            staffDto.serviceIds = JSON.parse(staffDto.serviceIds);
        }
        
        if (staffDto.serviceIds) {
            await Promise.all(
                staffDto.serviceIds.map(serviceId => {
                    this.staffRepository.createStaffService(staff.id.toString(), serviceId.toString())
                })
            );
        }
        return await this.getStaffById(staff.id);
    }

    /**
     * Personel bilgilerini günceller
     * @param id Personel ID
     * @param staffDto Güncellenecek personel bilgileri
     * @param file Yüklenen avatar dosyası
     * @param req Express isteği
     * @returns Güncellenen personel
     */
    public async updateStaff(id: string, staffDto: StaffUpdateDTO, file: Express.Multer.File | undefined, req: any): Promise<IStaff> {
        // Personel kontrolü
        const staff = await this.staffRepository.getStaffById(id);
        if (!staff) {
            throw ApiError.notFound('Personel bulunamadı');
        }

        // E-posta değiştirilmek isteniyorsa, mevcut bir personel tarafından kullanılıp kullanılmadığını kontrol et
        if (staffDto.email && staffDto.email !== staff.email) {
            const existingStaff = await this.staffRepository.findByEmail(staffDto.email);
            if (existingStaff) {
                throw ApiError.conflict('Bu email adresi başka bir personel tarafından kullanılıyor');
            }
        }

        // Avatar dosyası yüklendi mi kontrol et
        let avatarPath = staff.avatar;
        if (file) {
            // Eski avatar dosyasını sil
            if (staff.avatar) {
                const oldAvatarUrl = staff.avatar;
                const oldAvatarPath = oldAvatarUrl.substring(oldAvatarUrl.indexOf('/uploads/') + 9);
                const fullPath = path.join(__dirname, '../../../uploads', oldAvatarPath);
                await deleteFile(fullPath);
            }
            
            // Yeni avatar dosyasını kaydet
            const fileName = file.filename;
            avatarPath = generateFileUrl(req, path.join('profiles', fileName));
        }

        // Personeli güncelle
        const updateData: Partial<IStaff> = {
            fullName: staffDto.fullName || staff.fullName,
            email: staffDto.email || staff.email,
            phone: staffDto.phone || staff.phone,
            specialties: staffDto.specialties !== undefined ? staffDto.specialties : staff.specialties,
            isActive: staffDto.isActive !== undefined ? staffDto.isActive : staff.isActive,
            avatar: avatarPath
        };

        await this.staffRepository.updateStaff(id, updateData);

        // Hizmet ilişkilerini güncelle
        if (staffDto.serviceIds) {
            // Mevcut ilişkileri sil
            await this.staffRepository.deleteStaffServices(id);
            
            // Yeni ilişkileri oluştur
            if (staffDto.serviceIds.length > 0) {
                await Promise.all(
                    staffDto.serviceIds.map(serviceId => 
                        this.staffRepository.createStaffService(id, serviceId)
                    )
                );
            }
        }

        // Güncellenen personeli tüm ilişkileriyle birlikte getir
        return await this.getStaffById(id);
    }

    /**
     * Personel kaydını siler
     * @param id Personel ID
     * @returns İşlem başarılı ise true
     */
    public async deleteStaff(id: string): Promise<boolean> {
        // Personel kontrolü
        const staff = await this.staffRepository.getStaffById(id);
        if (!staff) {
            throw ApiError.notFound('Personel bulunamadı');
        }

        // Avatar dosyasını sil
        if (staff.avatar) {
            const avatarUrl = staff.avatar;
            const avatarPath = avatarUrl.substring(avatarUrl.indexOf('/uploads/') + 9);
            const fullPath = path.join(__dirname, '../../../uploads', avatarPath);
            await deleteFile(fullPath);
        }

        // Hizmet ilişkilerini sil
        await this.staffRepository.deleteStaffServices(id);

        // Personeli sil
        const result = await this.staffRepository.deleteStaff(id);
        if (!result) {
            throw ApiError.internal('Personel silinirken bir hata oluştu');
        }
        
        return result;
    }
}

export default StaffService; 