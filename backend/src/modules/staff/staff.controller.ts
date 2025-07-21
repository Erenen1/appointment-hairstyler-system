import { NextFunction, Request, Response } from "express";
import StaffService from "./staff.service";
import { ApiSuccess, ApiError } from "../../utils";
import { StaffCreateDTO, StaffUpdateDTO } from "./dto";

/**
 * Personel işlemleri için controller sınıfı
 */
class StaffController {
    private staffService: StaffService;

    constructor(staffService: StaffService) {
        this.staffService = staffService;
    }

    /**
     * İşletmeye ait tüm personelleri getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getAllStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const businessId = (req as any).businessId;
            if (!businessId) {
                throw ApiError.badRequest('İşletme bilgisi bulunamadı');
            }

            const isActive = req.query.isActive === 'true' ? true : 
                           req.query.isActive === 'false' ? false : undefined;
            
            const staff = await this.staffService.getAllStaff(businessId, isActive);
            res.status(200).json(ApiSuccess.list(staff, undefined, 'Personeller başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * ID'ye göre personel getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getStaffById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const businessId = (req as any).businessId;
            if (!businessId) {
                throw ApiError.badRequest('İşletme bilgisi bulunamadı');
            }

            const id = req.params.id;
            const staff = await this.staffService.getStaffById(id, businessId);
            res.status(200).json(ApiSuccess.item(staff, 'Personel detayları başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Yeni personel oluşturur
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async createStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const staffDto: StaffCreateDTO = req.body;
            
            const businessId = (req as any).businessId;
            if (!businessId) {
                throw ApiError.badRequest('İşletme bilgisi bulunamadı');
            }

            const staff = await this.staffService.createStaff(staffDto, businessId, req.file, req);
            res.status(201).json(ApiSuccess.created(staff, 'Personel başarıyla oluşturuldu'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Personel bilgilerini günceller
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async updateStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const staffDto: StaffUpdateDTO = req.body;
            
            // isActive string olarak geldiyse boolean'a çevir
            if (req.body.isActive !== undefined) {
                staffDto.isActive = req.body.isActive === 'true';
            }
            
            const businessId = (req as any).businessId;
            if (!businessId) {
                throw ApiError.badRequest('İşletme bilgisi bulunamadı');
            }

            const staff = await this.staffService.updateStaff(id, businessId, staffDto, req.file, req);
            res.status(200).json(ApiSuccess.updated(staff, 'Personel başarıyla güncellendi'));
        } catch (error) {
            next(error);
        }
    }

    /**
     * Personel kaydını siler
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async deleteStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const businessId = (req as any).businessId;
            if (!businessId) {
                throw ApiError.badRequest('İşletme bilgisi bulunamadı');
            }

            const id = req.params.id;
            await this.staffService.deleteStaff(id, businessId);
            res.status(200).json(ApiSuccess.deleted('Personel başarıyla silindi'));
        } catch (error) {
            next(error);
        }
    }
}

export default StaffController; 