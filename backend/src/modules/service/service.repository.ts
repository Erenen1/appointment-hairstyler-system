import { IService, IServiceCategory, IServiceImage } from "./service.interface";
import { BaseRepository } from "../common/base.repository";
import db from "../../models";
import { Op } from "sequelize";

const { Service, ServiceCategory, ServiceImage, StaffService, Staff } = db;

/**
 * Hizmet veritabanı işlemleri için repository sınıfı
 */
class ServiceRepository extends BaseRepository<IService> {
    constructor() {
        super(Service);
    }

    /**
     * Tüm hizmetleri getirir
     * @param filters Filtre parametreleri
     * @returns Hizmet listesi
     */
    public async getAllServices(filters?: { search?: string, categoryId?: string, isActive?: boolean }): Promise<IService[]> {
        const where: any = {};
        
        if (filters?.search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${filters.search}%` } },
                { description: { [Op.iLike]: `%${filters.search}%` } }
            ];
        }
        
        if (filters?.categoryId) {
            where.categoryId = filters.categoryId;
        }
        
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        
        const services = await Service.findAll({
            where,
            include: [
                {
                    model: ServiceCategory,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: ServiceImage,
                    as: 'images',
                    attributes: ['id', 'imagePath', 'isMain', 'orderIndex']
                },
                {
                    model: Staff,
                    as: 'staffMembers',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'fullName', 'isActive']
                }
            ],
            order: [['orderIndex', 'ASC']]
        });

        return services.map(service => {
            const mainImage = service.images?.find(img => img.isMain)?.imagePath || 
                service.images?.[0]?.imagePath;
            
            return {
                ...service.toJSON(),
                staffMembers: service.staffMembers?.filter(staff => staff.isActive && staff.StaffService?.isActive)?.map(staff => ({
                    id: staff.id,
                    fullName: staff.fullName
                })) || []
            };
        });
    }

    /**
     * ID'ye göre hizmet getirir
     * @param id Hizmet ID
     * @returns Hizmet bilgileri
     */
    public async getServiceById(id: string): Promise<IService | null> {
        const service = await Service.findByPk(id, {
            include: [
                {
                    model: ServiceCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: ServiceImage,
                    as: 'images',
                    attributes: ['id', 'imagePath', 'isMain', 'orderIndex']
                },
                {
                    model: Staff,
                    as: 'staffMembers',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'fullName', 'isActive']
                }
            ]
        });
        
        if (!service) {
            return null;
        }

        return {
            ...service.toJSON(),
            staffMembers: service.staffMembers?.filter(staff => staff.isActive && staff.StaffService?.isActive)?.map(staff => ({
                id: staff.id,
                fullName: staff.fullName
            })) || []
        };
    }

    /**
     * Slug'a göre hizmet getirir
     * @param slug Hizmet slug
     * @returns Hizmet bilgileri
     */
    public async getServiceBySlug(slug: string): Promise<IService | null> {
        const service = await Service.findOne({
            where: { slug },
            include: [
                {
                    model: ServiceCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                },
                {
                    model: ServiceImage,
                    as: 'images',
                    attributes: ['id', 'imagePath', 'isMain', 'orderIndex']
                },
                {
                    model: Staff,
                    as: 'staffMembers',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'fullName', 'isActive']
                }
            ]
        });
        
        if (!service) {
            return null;
        }

        return {
            ...service.toJSON(),
            staffMembers: service.staffMembers?.filter(staff => staff.isActive && staff.StaffService?.isActive)?.map(staff => ({
                id: staff.id,
                fullName: staff.fullName
            })) || []
        };
    }

    /**
     * Yeni hizmet oluşturur
     * @param service Hizmet bilgileri
     * @returns Oluşturulan hizmet
     */
    public async createService(service: IService): Promise<IService> {
        return await this.create(service);
    }

    /**
     * Hizmet bilgilerini günceller
     * @param id Hizmet ID
     * @param service Güncellenecek hizmet bilgileri
     * @returns Güncellenen hizmet
     */
    public async updateService(id: string, service: Partial<IService>): Promise<IService | null> {
        return await this.update(id, service);
    }

    /**
     * Hizmet kaydını siler
     * @param id Hizmet ID
     * @returns İşlem başarılı ise true
     */
    public async deleteService(id: string): Promise<boolean> {
        return await this.delete(id);
    }

    /**
     * Hizmet resmi oluşturur
     * @param serviceImage Hizmet resmi bilgileri
     * @returns Oluşturulan hizmet resmi
     */
    public async createServiceImage(serviceImage: IServiceImage): Promise<IServiceImage> {
        return await ServiceImage.create(serviceImage);
    }

    /**
     * Hizmet resimlerini siler
     * @param serviceId Hizmet ID
     * @returns İşlem başarılı ise true
     */
    public async deleteServiceImages(serviceId: string): Promise<boolean> {
        const result = await ServiceImage.destroy({
            where: { serviceId }
        });
        
        return result > 0;
    }

    /**
     * Hizmet-Personel ilişkisi oluşturur
     * @param serviceId Hizmet ID
     * @param staffId Personel ID
     * @returns Oluşturulan ilişki
     */
    public async createStaffService(serviceId: string, staffId: string): Promise<any> {
        return await StaffService.create({
            serviceId,
            staffId,
            isActive: true
        });
    }

    /**
     * Hizmetin tüm personel ilişkilerini siler
     * @param serviceId Hizmet ID
     * @returns İşlem başarılı ise true
     */
    public async deleteStaffServices(serviceId: string): Promise<boolean> {
        const result = await StaffService.destroy({
            where: { serviceId }
        });
        
        return result > 0;
    }

    /**
     * Tüm hizmet kategorilerini getirir
     * @param isActive Aktiflik durumu filtresi (opsiyonel)
     * @returns Hizmet kategorisi listesi
     */
    public async getAllServiceCategories(isActive?: boolean): Promise<IServiceCategory[]> {
        const where: any = {};
        
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        
        return await ServiceCategory.findAll({
            where,
            order: [['orderIndex', 'ASC']]
        });
    }

    /**
     * ID'ye göre hizmet kategorisi getirir
     * @param id Hizmet kategorisi ID
     * @returns Hizmet kategorisi bilgileri
     */
    public async getServiceCategoryById(id: string): Promise<IServiceCategory | null> {
        return await ServiceCategory.findByPk(id);
    }

    /**
     * Yeni hizmet kategorisi oluşturur
     * @param category Hizmet kategorisi bilgileri
     * @returns Oluşturulan hizmet kategorisi
     */
    public async createServiceCategory(category: IServiceCategory): Promise<IServiceCategory> {
        return await ServiceCategory.create(category);
    }

    /**
     * Hizmet kategorisi bilgilerini günceller
     * @param id Hizmet kategorisi ID
     * @param category Güncellenecek hizmet kategorisi bilgileri
     * @returns Güncellenen hizmet kategorisi
     */
    public async updateServiceCategory(id: string, category: Partial<IServiceCategory>): Promise<IServiceCategory | null> {
        const serviceCategory = await ServiceCategory.findByPk(id);
        
        if (!serviceCategory) {
            return null;
        }
        
        await serviceCategory.update(category);
        return serviceCategory;
    }

    /**
     * Hizmet kategorisi kaydını siler
     * @param id Hizmet kategorisi ID
     * @returns İşlem başarılı ise true
     */
    public async deleteServiceCategory(id: string): Promise<boolean> {
        const result = await ServiceCategory.destroy({
            where: { id }
        });
        
        return result > 0;
    }
}

export default ServiceRepository; 