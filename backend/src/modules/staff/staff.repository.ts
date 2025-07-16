import { IStaff, IStaffService } from "./staff.interface";
import { BaseRepository } from "../common/base.repository";
import db from "../../models";
import { Op } from "sequelize";

const { Staff, StaffService, Service, ServiceCategory } = db;

/**
 * Personel veritabanı işlemleri için repository sınıfı
 */
class StaffRepository extends BaseRepository<IStaff> {
    constructor() {
        super(Staff);
    }

    /**
     * Tüm personelleri getirir
     * @param isActive Aktiflik durumu filtresi (opsiyonel)
     * @returns Personel listesi
     */
    public async getAllStaff(isActive?: boolean): Promise<IStaff[]> {
        const whereConditions: any = {};

        if (isActive !== undefined) {
            whereConditions.isActive = isActive;
        }

        const staff = await Staff.findAll({
            where: whereConditions,
            include: [
                {
                    model: Service,
                    as: 'services',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'title', 'price', 'duration'],
                    include: [
                        {
                            model: ServiceCategory,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        return staff.map(staffItem => ({
            ...staffItem.toJSON(),
            services: staffItem.services?.filter(service => service.StaffService?.isActive)?.map(service => ({
                id: service.id,
                title: service.title,
                price: service.price,
                duration: service.duration,
                category: service.category
            })) || []
        }));
    }

    /**
     * ID'ye göre personel getirir
     * @param id Personel ID
     * @returns Personel bilgileri
     */
    public async getStaffById(id: string): Promise<IStaff | null> {
        const staff = await Staff.findByPk(id, {
            include: [
                {
                    model: Service,
                    as: 'services',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'title', 'description', 'price', 'duration'],
                    include: [
                        {
                            model: ServiceCategory,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!staff) {
            return null;
        }

        return {
            ...staff.toJSON(),
            services: staff.services?.filter(service => service.StaffService?.isActive)?.map(service => ({
                id: service.id,
                title: service.title,
                description: service.description,
                price: service.price,
                duration: service.duration,
                category: service.category
            })) || []
        };
    }

    /**
     * E-posta adresine göre personel arar
     * @param email Personel e-posta adresi
     * @returns Bulunan personel veya null
     */
    public async findByEmail(email: string): Promise<IStaff | null> {
        return await Staff.findOne({ where: { email: email } });
    }

    /**
     * Yeni personel oluşturur
     * @param staff Personel bilgileri
     * @returns Oluşturulan personel
     */
    public async createStaff(staff: IStaff): Promise<IStaff> {
        return await this.create(staff);
    }

    /**
     * Personel bilgilerini günceller
     * @param id Personel ID
     * @param staff Güncellenecek personel bilgileri
     * @returns Güncellenen personel
     */
    public async updateStaff(id: string, staff: Partial<IStaff>): Promise<IStaff | null> {
        return await this.update(id, staff);
    }

    /**
     * Personel kaydını siler
     * @param id Personel ID
     * @returns İşlem başarılı ise true
     */
    public async deleteStaff(id: string): Promise<boolean> {
        return await this.delete(id);
    }

    /**
     * Personel-Hizmet ilişkisi oluşturur
     * @param staffId Personel ID
     * @param serviceId Hizmet ID
     * @returns Oluşturulan ilişki
     */
    public async createStaffService(staffId: string, serviceId: string): Promise<IStaffService> {
        return await StaffService.create({
            staffId,
            serviceId,
            isActive: true
        });
    }

    /**
     * Personelin tüm hizmet ilişkilerini siler
     * @param staffId Personel ID
     * @returns İşlem başarılı ise true
     */
    public async deleteStaffServices(staffId: string): Promise<boolean> {
        const result = await StaffService.destroy({
            where: { staffId }
        });

        return result > 0;
    }
}

export default StaffRepository; 