import { ApiError } from "../../utils/ApiError";
import ServiceRepository from "./service.repository";
import { ServiceCreateDTO, ServiceUpdateDTO, ServiceCategoryCreateDTO, ServiceCategoryUpdateDTO } from "./dto";
import { IService, IServiceCategory, IServiceImage } from "./service.interface";
import path from "path";
import { generateFileUrl, deleteFile } from "../../config/multer";
import db from "../../models";

const { ServiceImage } = db;

/**
 * Metni slug formatına dönüştürür
 * @param text Dönüştürülecek metin
 * @returns Slug formatında metin
 */
const generateSlug = (text: string): string => {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

/**
 * Hizmet işlemleri için servis sınıfı
 */
class ServiceService {
    private serviceRepository: ServiceRepository;

    constructor(serviceRepository: ServiceRepository) {
        this.serviceRepository = serviceRepository;
    }

    /**
     * Tüm hizmetleri getirir
     * @param filters Filtre parametreleri
     * @returns Hizmet listesi
     */
    public async getAllServices(filters?: { search?: string, categoryId?: string, isActive?: boolean }): Promise<IService[]> {
        return await this.serviceRepository.getAllServices(filters);
    }

    /**
     * ID'ye göre hizmet getirir
     * @param id Hizmet ID
     * @returns Hizmet bilgileri
     */
    public async getServiceById(id: string): Promise<IService> {
        const service = await this.serviceRepository.getServiceById(id);
        if (!service) {
            throw ApiError.notFound('Hizmet bulunamadı');
        }
        return service;

    }

    /**
     * Slug'a göre hizmet getirir
     * @param slug Hizmet slug
     * @returns Hizmet bilgileri
     */
    public async getServiceBySlug(slug: string): Promise<IService> {
        const service = await this.serviceRepository.getServiceBySlug(slug);
        if (!service) {
            throw ApiError.notFound('Hizmet bulunamadı');
        }
        return service;
    }

    /**
     * Yeni hizmet oluşturur
     * @param serviceDto Hizmet bilgileri
     * @param file Yüklenen resim dosyası
     * @param req Express isteği
     * @returns Oluşturulan hizmet
     */
    public async createService(serviceDto: ServiceCreateDTO, file: Express.Multer.File | undefined, req: any): Promise<IService> {
        // Kategori kontrolü
        const category = await this.serviceRepository.getServiceCategoryById(serviceDto.categoryId);
        if (!category) {
            throw ApiError.badRequest('Geçersiz kategori ID');
        }

        // Slug oluştur
        const slug = serviceDto.slug || generateSlug(serviceDto.title);

        // Hizmet oluştur
        const service = await this.serviceRepository.createService({
            ...serviceDto,
            slug,
            isActive: serviceDto.isActive !== undefined ? serviceDto.isActive : true,
            orderIndex: serviceDto.orderIndex || 0,
        } as IService);

        // Resim yüklendi mi kontrol et
        if (file) {
            const fileName = file.filename;
            const imagePath = generateFileUrl(req, path.join('services', fileName));

            // Hizmet resmi oluştur
            await this.serviceRepository.createServiceImage({
                serviceId: service.id,
                imagePath,
                isMain: true,
                orderIndex: 0,
            } as IServiceImage);
        }

        // Personel ilişkilerini oluştur
        if (serviceDto.staffIds && serviceDto.staffIds.length > 0) {
            await Promise.all(
                serviceDto.staffIds.map(staffId =>
                    this.serviceRepository.createStaffService(service.id, staffId)
                )
            );
        }

        // Oluşturulan hizmeti tüm ilişkileriyle birlikte getir
        return await this.getServiceById(service.id);
    }

    /**
     * Hizmet bilgilerini günceller
     * @param id Hizmet ID
     * @param serviceDto Güncellenecek hizmet bilgileri
     * @param file Yüklenen resim dosyası
     * @param req Express isteği
     * @returns Güncellenen hizmet
     */
    public async updateService(id: string, serviceDto: ServiceUpdateDTO, file: Express.Multer.File | undefined, req: any): Promise<IService> {
        // Hizmet kontrolü
        const service = await this.serviceRepository.getServiceById(id);
        if (!service) {
            throw ApiError.notFound('Hizmet bulunamadı');
        }

        // Kategori değiştirilmek isteniyorsa, geçerli bir kategori mi kontrol et
        if (serviceDto.categoryId) {
            const category = await this.serviceRepository.getServiceCategoryById(serviceDto.categoryId);
            if (!category) {
                throw ApiError.badRequest('Geçersiz kategori ID');
            }
        }

        // Slug oluştur (eğer başlık değiştiyse ve slug belirtilmediyse)
        let slug = service.slug;
        if (serviceDto.title && serviceDto.title !== service.title && !serviceDto.slug) {
            slug = generateSlug(serviceDto.title);
        } else if (serviceDto.slug) {
            slug = serviceDto.slug;
        }

        // Hizmeti güncelle
        const updateData: Partial<IService> = {
            ...serviceDto,
            slug
        };

        await this.serviceRepository.updateService(id, updateData);

        // Resim yüklendi mi kontrol et
        if (file) {
            const fileName = file.filename;
            const imagePath = generateFileUrl(req, path.join('services', fileName));

            // Mevcut ana resmi bul
            const mainImage = service.images?.find(img => img.isMain);

            if (mainImage) {
                // Eski resmi sil
                if (mainImage.imagePath) {
                    const oldImageUrl = mainImage.imagePath;
                    const oldImagePath = oldImageUrl.substring(oldImageUrl.indexOf('/uploads/') + 9);
                    const fullPath = path.join(__dirname, '../../../uploads', oldImagePath);
                    await deleteFile(fullPath);
                }

                // Ana resmi güncelle
                await ServiceImage.update(
                    { imagePath },
                    { where: { id: mainImage.id } }
                );
            } else {
                // Yeni ana resim oluştur
                await this.serviceRepository.createServiceImage({
                    serviceId: id,
                    imagePath,
                    isMain: true,
                    orderIndex: 0,
                } as IServiceImage);
            }
        }

        // Personel ilişkilerini güncelle
        if (serviceDto.staffIds) {
            // Mevcut ilişkileri sil
            await this.serviceRepository.deleteStaffServices(id);

            // Yeni ilişkileri oluştur
            if (serviceDto.staffIds.length > 0) {
                await Promise.all(
                    serviceDto.staffIds.map(staffId =>
                        this.serviceRepository.createStaffService(id, staffId)
                    )
                );
            }
        }

        // Güncellenen hizmeti tüm ilişkileriyle birlikte getir
        return await this.getServiceById(id);
    }

    /**
     * Hizmet kaydını siler
     * @param id Hizmet ID
     * @returns İşlem başarılı ise true
     */
    public async deleteService(id: string): Promise<boolean> {

        // Hizmet kontrolü
        const service = await this.serviceRepository.getServiceById(id);
        if (!service) {
            throw ApiError.notFound('Hizmet bulunamadı');
        }

        // Hizmet resimlerini sil
        if (service.images && service.images.length > 0) {
            for (const image of service.images) {
                if (image.imagePath) {
                    const imageUrl = image.imagePath;
                    const imagePath = imageUrl.substring(imageUrl.indexOf('/uploads/') + 9);
                    const fullPath = path.join(__dirname, '../../../uploads', imagePath);
                    await deleteFile(fullPath);
                }
            }

            await this.serviceRepository.deleteServiceImages(id);
        }

        // Personel ilişkilerini sil
        await this.serviceRepository.deleteStaffServices(id);

        // Hizmeti sil
        const result = await this.serviceRepository.deleteService(id);
        if (!result) {
            throw ApiError.internal('Hizmet silinirken bir hata oluştu');
        }

        return result;
    }

    /**
     * Tüm hizmet kategorilerini getirir
     * @param isActive Aktiflik durumu filtresi (opsiyonel)
     * @returns Hizmet kategorisi listesi
     */
    public async getAllServiceCategories(isActive?: boolean): Promise<IServiceCategory[]> {
        return await this.serviceRepository.getAllServiceCategories(isActive);
    }

    /**
     * ID'ye göre hizmet kategorisi getirir
     * @param id Hizmet kategorisi ID
     * @returns Hizmet kategorisi bilgileri
     */
    public async getServiceCategoryById(id: string): Promise<IServiceCategory> {

        const category = await this.serviceRepository.getServiceCategoryById(id);
        if (!category) {
            throw ApiError.notFound('Hizmet kategorisi bulunamadı');
        }
        return category;
    }

    /**
     * Yeni hizmet kategorisi oluşturur
     * @param categoryDto Hizmet kategorisi bilgileri
     * @param file Yüklenen resim dosyası
     * @param req Express isteği
     * @returns Oluşturulan hizmet kategorisi
     */
    public async createServiceCategory(categoryDto: ServiceCategoryCreateDTO, file: Express.Multer.File | undefined, req: any): Promise<IServiceCategory> {
        // Resim yüklendi mi kontrol et
        let imagePath = null;
        if (file) {
            const fileName = file.filename;
            imagePath = generateFileUrl(req, path.join('services', fileName));
        }

        // Kategori oluştur
        const category = await this.serviceRepository.createServiceCategory({
            ...categoryDto,
            imagePath,
            isActive: categoryDto.isActive !== undefined ? categoryDto.isActive : true,
            orderIndex: categoryDto.orderIndex || 0,
            id: ''  // UUID otomatik oluşturulacak
        } as IServiceCategory);

        return category;
    }

    /**
     * Hizmet kategorisi bilgilerini günceller
     * @param id Hizmet kategorisi ID
     * @param categoryDto Güncellenecek hizmet kategorisi bilgileri
     * @param file Yüklenen resim dosyası
     * @param req Express isteği
     * @returns Güncellenen hizmet kategorisi
     */
    public async updateServiceCategory(id: string, categoryDto: ServiceCategoryUpdateDTO, file: Express.Multer.File | undefined, req: any): Promise<IServiceCategory> {

        // Kategori kontrolü
        const category = await this.serviceRepository.getServiceCategoryById(id);
        if (!category) {
            throw ApiError.notFound('Hizmet kategorisi bulunamadı');
        }

        // Resim yüklendi mi kontrol et
        let imagePath = category.imagePath;
        if (file) {
            // Eski resmi sil
            if (category.imagePath) {
                const oldImageUrl = category.imagePath;
                const oldImagePath = oldImageUrl.substring(oldImageUrl.indexOf('/uploads/') + 9);
                const fullPath = path.join(__dirname, '../../../uploads', oldImagePath);
                await deleteFile(fullPath);
            }

            // Yeni resmi kaydet
            const fileName = file.filename;
            imagePath = generateFileUrl(req, path.join('services', fileName));
        }

        // Kategoriyi güncelle
        const updateData: Partial<IServiceCategory> = {
            ...categoryDto,
            imagePath
        };

        const updatedCategory = await this.serviceRepository.updateServiceCategory(id, updateData);
        if (!updatedCategory) {
            throw ApiError.internal('Kategori güncellenirken bir hata oluştu');
        }

        return updatedCategory;
    }

    /**
     * Hizmet kategorisi kaydını siler
     * @param id Hizmet kategorisi ID
     * @returns İşlem başarılı ise true
     */
    public async deleteServiceCategory(id: string): Promise<boolean> {

        // Kategori kontrolü
        const category = await this.serviceRepository.getServiceCategoryById(id);
        if (!category) {
            throw ApiError.notFound('Hizmet kategorisi bulunamadı');
        }

        // Kategoriye ait hizmetleri kontrol et
        const services = await this.serviceRepository.getAllServices({ categoryId: id });
        if (services.length > 0) {
            throw ApiError.badRequest('Bu kategoriye ait hizmetler bulunmaktadır. Önce bu hizmetleri silmelisiniz.');
        }

        // Resmi sil
        if (category.imagePath) {
            const imageUrl = category.imagePath;
            const imagePath = imageUrl.substring(imageUrl.indexOf('/uploads/') + 9);
            const fullPath = path.join(__dirname, '../../../uploads', imagePath);
            await deleteFile(fullPath);
        }

        // Kategoriyi sil
        const result = await this.serviceRepository.deleteServiceCategory(id);
        if (!result) {
            throw ApiError.internal('Kategori silinirken bir hata oluştu');
        }

        return result;
    }
}

export default ServiceService; 