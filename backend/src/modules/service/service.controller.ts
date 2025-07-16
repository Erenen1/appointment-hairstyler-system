import { NextFunction, Request, Response } from "express";
import ServiceService from "./service.service";
import { ApiSuccess } from "../../utils/ApiResponse";
import { ServiceCreateDTO, ServiceUpdateDTO, ServiceCategoryCreateDTO, ServiceCategoryUpdateDTO } from "./dto";

/**
 * Hizmet işlemleri için controller sınıfı
 */
class ServiceController {
    private serviceService: ServiceService;

    constructor(serviceService: ServiceService) {
        this.serviceService = serviceService;
    }

    /**
     * Tüm hizmetleri getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getAllServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters = {
                search: req.query.search as string,
                categoryId: req.query.categoryId as string,
                isActive: req.query.isActive === 'true' ? true : 
                          req.query.isActive === 'false' ? false : undefined
            };
            
            const services = await this.serviceService.getAllServices(filters);
            res.status(200).json(ApiSuccess.list(services, undefined, 'Hizmetler başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * ID'ye göre hizmet getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getServiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const service = await this.serviceService.getServiceById(id);
            res.status(200).json(ApiSuccess.item(service, 'Hizmet detayları başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Slug'a göre hizmet getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getServiceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slug = req.params.slug;
            const service = await this.serviceService.getServiceBySlug(slug);
            res.status(200).json(ApiSuccess.item(service, 'Hizmet detayları başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Yeni hizmet oluşturur
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const serviceDto: ServiceCreateDTO = req.body;
            
            // staffIds string olarak geldiyse JSON'a çevir
            if (req.body.staffIds && typeof req.body.staffIds === 'string') {
                serviceDto.staffIds = JSON.parse(req.body.staffIds);
            }
            
            // benefits, includes, recommendedFor, beforeAfterImages JSON olarak geldiyse parse et
            ['benefits', 'includes', 'recommendedFor', 'beforeAfterImages'].forEach(field => {
                if (req.body[field] && typeof req.body[field] === 'string') {
                    serviceDto[field] = JSON.parse(req.body[field]);
                }
            });
            
            // isActive string olarak geldiyse boolean'a çevir
            if (req.body.isActive !== undefined) {
                serviceDto.isActive = req.body.isActive === 'true';
            }
            
            // orderIndex string olarak geldiyse number'a çevir
            if (req.body.orderIndex !== undefined) {
                serviceDto.orderIndex = Number(req.body.orderIndex);
            }
            
            const service = await this.serviceService.createService(serviceDto, req.file, req);
            res.status(201).json(ApiSuccess.created(service, 'Hizmet başarıyla oluşturuldu'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Hizmet bilgilerini günceller
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const serviceDto: ServiceUpdateDTO = req.body;
            
            // staffIds string olarak geldiyse JSON'a çevir
            if (req.body.staffIds && typeof req.body.staffIds === 'string') {
                serviceDto.staffIds = JSON.parse(req.body.staffIds);
            }
            
            // benefits, includes, recommendedFor, beforeAfterImages JSON olarak geldiyse parse et
            ['benefits', 'includes', 'recommendedFor', 'beforeAfterImages'].forEach(field => {
                if (req.body[field] && typeof req.body[field] === 'string') {
                    serviceDto[field] = JSON.parse(req.body[field]);
                }
            });
            
            // isActive string olarak geldiyse boolean'a çevir
            if (req.body.isActive !== undefined) {
                serviceDto.isActive = req.body.isActive === 'true';
            }
            
            // orderIndex string olarak geldiyse number'a çevir
            if (req.body.orderIndex !== undefined) {
                serviceDto.orderIndex = Number(req.body.orderIndex);
            }
            
            const service = await this.serviceService.updateService(id, serviceDto, req.file, req);
            res.status(200).json(ApiSuccess.updated(service, 'Hizmet başarıyla güncellendi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Hizmet kaydını siler
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            await this.serviceService.deleteService(id);
            res.status(200).json(ApiSuccess.deleted('Hizmet başarıyla silindi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Tüm hizmet kategorilerini getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getAllServiceCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isActive = req.query.isActive === 'true' ? true : 
                           req.query.isActive === 'false' ? false : undefined;
            
            const categories = await this.serviceService.getAllServiceCategories(isActive);
            res.status(200).json(ApiSuccess.list(categories, undefined, 'Hizmet kategorileri başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * ID'ye göre hizmet kategorisi getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getServiceCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const category = await this.serviceService.getServiceCategoryById(id);
            res.status(200).json(ApiSuccess.item(category, 'Hizmet kategorisi başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Yeni hizmet kategorisi oluşturur
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async createServiceCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categoryDto: ServiceCategoryCreateDTO = req.body;
            
            // isActive string olarak geldiyse boolean'a çevir
            if (req.body.isActive !== undefined) {
                categoryDto.isActive = req.body.isActive === 'true';
            }
            
            // orderIndex string olarak geldiyse number'a çevir
            if (req.body.orderIndex !== undefined) {
                categoryDto.orderIndex = Number(req.body.orderIndex);
            }
            
            const category = await this.serviceService.createServiceCategory(categoryDto, req.file, req);
            res.status(201).json(ApiSuccess.created(category, 'Hizmet kategorisi başarıyla oluşturuldu'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Hizmet kategorisi bilgilerini günceller
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async updateServiceCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const categoryDto: ServiceCategoryUpdateDTO = req.body;
            
            // isActive string olarak geldiyse boolean'a çevir
            if (req.body.isActive !== undefined) {
                categoryDto.isActive = req.body.isActive === 'true';
            }
            
            // orderIndex string olarak geldiyse number'a çevir
            if (req.body.orderIndex !== undefined) {
                categoryDto.orderIndex = Number(req.body.orderIndex);
            }
            
            const category = await this.serviceService.updateServiceCategory(id, categoryDto, req.file, req);
            res.status(200).json(ApiSuccess.updated(category, 'Hizmet kategorisi başarıyla güncellendi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Hizmet kategorisi kaydını siler
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async deleteServiceCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            await this.serviceService.deleteServiceCategory(id);
            res.status(200).json(ApiSuccess.deleted('Hizmet kategorisi başarıyla silindi'));
        } catch (error) {
            next(error);
        }
    }
}

export default ServiceController; 