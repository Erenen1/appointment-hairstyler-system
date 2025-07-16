import { NextFunction, Request, Response } from "express";
import StaffService from "./staff.service";
import { ApiSuccess } from "../../utils/ApiResponse";
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
     * Tüm personelleri getirir
     * @param req Express isteği
     * @param res Express yanıtı
     * @param next Express sonraki fonksiyon
     */
    public async getAllStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isActive = req.query.isActive === 'true' ? true : 
                           req.query.isActive === 'false' ? false : undefined;
            
            const staff = await this.staffService.getAllStaff(isActive);
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
            const id = req.params.id;
            const staff = await this.staffService.getStaffById(id);
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
            
            // serviceIds kontrolü - controller'da dönüşüm yapmaya gerek yok
            // service katmanında hallediliyor
            
            const staff = await this.staffService.createStaff(staffDto, req.file, req);
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
            
            // serviceIds kontrolü - controller'da dönüşüm yapmaya gerek yok
            // service katmanında hallediliyor
            
            // isActive string olarak geldiyse boolean'a çevir
            if (req.body.isActive !== undefined) {
                staffDto.isActive = req.body.isActive === 'true';
            }
            
            const staff = await this.staffService.updateStaff(id, staffDto, req.file, req);
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
            const id = req.params.id;
            await this.staffService.deleteStaff(id);
            res.status(200).json(ApiSuccess.deleted('Personel başarıyla silindi'));
        } catch (error) {
            next(error);
        }
    }
}

export default StaffController; 