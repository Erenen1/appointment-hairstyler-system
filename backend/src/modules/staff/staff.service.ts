import { ApiError } from "../../utils";
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
     * İşletmeye ait tüm personelleri getirir
     * @param businessId İşletme ID
     * @param isActive Aktiflik durumu filtresi (opsiyonel)
     * @returns Personel listesi
     */
    public async getAllStaff(businessId: string, isActive?: boolean): Promise<IStaff[]> {
        return await this.staffRepository.getAllStaff(businessId, isActive);
    }

    /**
     * İşletmeye ait ID'ye göre personel getirir
     * @param id Personel ID
     * @param businessId İşletme ID
     * @returns Personel bilgileri
     */
    public async getStaffById(id: string, businessId: string): Promise<IStaff> {
        const staff = await this.staffRepository.getStaffById(id, businessId);
        if (!staff) {
            throw ApiError.notFound('Personel bulunamadı');
        }
        return staff;
    }

    /**
     * Yeni personel oluşturur
     * @param staffDto Personel bilgileri
     * @param businessId İşletme ID
     * @param file Yüklenen avatar dosyası
     * @param req Express isteği
     * @returns Oluşturulan personel
     */
    public async createStaff(staffDto: StaffCreateDTO, businessId: string, file: Express.Multer.File | undefined, req: any): Promise<IStaff> {
        // E-posta kontrolü
        const existingStaff = await this.staffRepository.findByEmail(staffDto.email, businessId);
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
            businessId: businessId,
            isActive: true,
        });
        
        if(staffDto.serviceIds && typeof staffDto.serviceIds === 'string'){
            staffDto.serviceIds = JSON.parse(staffDto.serviceIds);
        }
        
        if (staffDto.serviceIds) {
            await Promise.all(
                staffDto.serviceIds.map(serviceId => {
                    this.staffRepository.createStaffService(staff.id.toString(), serviceId.toString(), businessId)
                })
            );
        }
        return await this.getStaffById(staff.id, businessId);
    }

    /**
     * Personel bilgilerini günceller
     * @param id Personel ID
     * @param businessId İşletme ID
     * @param staffDto Güncellenecek personel bilgileri
     * @param file Yüklenen avatar dosyası
     * @param req Express isteği
     * @returns Güncellenen personel
     */
    public async updateStaff(id: string, businessId: string, staffDto: StaffUpdateDTO, file: Express.Multer.File | undefined, req: any): Promise<IStaff> {
        // Personel kontrolü
        const staff = await this.staffRepository.getStaffById(id, businessId);
        if (!staff) {
            throw ApiError.notFound('Personel bulunamadı');
        }

        // E-posta değiştirilmek isteniyorsa, mevcut bir personel tarafından kullanılıp kullanılmadığını kontrol et
        if (staffDto.email && staffDto.email !== staff.email) {
            const existingStaff = await this.staffRepository.findByEmail(staffDto.email, businessId);
            if (existingStaff) {
                throw ApiError.conflict('Bu email adresi başka bir personel tarafından kullanılıyor');
            }
        }

        // Avatar dosyası güncellenecek mi kontrol et
        let avatarPath = staff.avatar;
        if (file) {
            // Eski avatar dosyasını sil
            if (staff.avatar) {
                await deleteFile(staff.avatar);
            }
            const fileName = file.filename;
            avatarPath = generateFileUrl(req, path.join('profiles', fileName));
        }

        // Personeli güncelle
        const updatedStaff = await this.staffRepository.updateStaff(id, businessId, {
            fullName: staffDto.fullName,
            email: staffDto.email,
            phone: staffDto.phone,
            specialties: staffDto.specialties,
            avatar: avatarPath,
            isActive: staffDto.isActive,
        });

        if (!updatedStaff) {
            throw ApiError.notFound('Personel güncellenemedi');
        }

        // Hizmet ilişkilerini güncelle
        if(staffDto.serviceIds && typeof staffDto.serviceIds === 'string'){
            staffDto.serviceIds = JSON.parse(staffDto.serviceIds);
        }
        
        if (staffDto.serviceIds) {
            // Eski ilişkileri sil
            await this.staffRepository.deleteStaffServices(id, businessId);
            
            // Yeni ilişkileri oluştur
            await Promise.all(
                staffDto.serviceIds.map(serviceId => {
                    this.staffRepository.createStaffService(id, serviceId.toString(), businessId)
                })
            );
        }

        return await this.getStaffById(id, businessId);
    }

    /**
     * Personel kaydını siler
     * @param id Personel ID
     * @param businessId İşletme ID
     * @returns İşlem başarılı ise true
     */
    public async deleteStaff(id: string, businessId: string): Promise<boolean> {
        // Personel kontrolü
        const staff = await this.staffRepository.getStaffById(id, businessId);
        if (!staff) {
            throw ApiError.notFound('Personel bulunamadı');
        }

        // Avatar dosyasını sil
        if (staff.avatar) {
            await deleteFile(staff.avatar);
        }

        // Hizmet ilişkilerini sil
        await this.staffRepository.deleteStaffServices(id, businessId);

        // Personeli sil
        return await this.staffRepository.deleteStaff(id, businessId);
    }

    /**
     * Personelin durumunu değiştirir (aktif/pasif)
     * @param id Personel ID
     * @param businessId İşletme ID
     * @returns Güncellenen personel
     */
    public async toggleStaffStatus(id: string, businessId: string): Promise<IStaff> {
        const staff = await this.staffRepository.getStaffById(id, businessId);
        if (!staff) {
            throw ApiError.notFound('Personel bulunamadı');
        }

        const updatedStaff = await this.staffRepository.updateStaff(id, businessId, {
            isActive: !staff.isActive
        });

        if (!updatedStaff) {
            throw ApiError.internal('Personel durumu güncellenemedi');
        }

        return updatedStaff;
    }
}

export default StaffService; 