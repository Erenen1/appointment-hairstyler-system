import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../../utils';
import AdminService from './admin.service';
import { CreateAdminDto, UpdateAdminDto, ChangePasswordDto } from './dto';
import { IAdminResponse } from './admin.interface';

class AdminController {
    private adminService: AdminService;

    constructor(adminService: AdminService) {
        this.adminService = adminService;
    }

    /**
     * Super admin tarafından yeni bir admin oluşturur
     */
    public createAdminWithApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const adminDto: CreateAdminDto = req.body;
            
            const adminData: IAdminResponse = await this.adminService.createAdmin(adminDto);
            
            res.status(201).json(ApiSuccess.created(adminData, 'Super Admin tarafından admin başarıyla oluşturuldu'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Tüm adminleri listeler
     */
    public getAllAdmins = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const admins: IAdminResponse[] = await this.adminService.getAllAdmins();
            res.json(ApiSuccess.list(admins, null, 'Adminler başarıyla listelendi'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * ID'ye göre admin detaylarını getirir
     */
    public getAdminById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const admin: IAdminResponse | null = await this.adminService.getAdminById(id);
            
            if (!admin) {
                throw ApiError.notFound('Admin bulunamadı');
            }
            
            res.json(ApiSuccess.item(admin, 'Admin detayları başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Admin bilgilerini günceller
     */
    public updateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const updateDto: UpdateAdminDto = req.body;
            
            const updatedAdmin: IAdminResponse = await this.adminService.updateAdmin(id, updateDto);
            
            res.json(ApiSuccess.updated(updatedAdmin, 'Admin bilgileri başarıyla güncellendi'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Admin şifresini değiştirir
     */
    public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { currentPassword, newPassword }: ChangePasswordDto = req.body;
            
            await this.adminService.changePassword(id, currentPassword, newPassword);
            
            res.json(ApiSuccess.item(null, 'Şifre başarıyla değiştirildi'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Admin kaydını siler
     */
    public deleteAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            
            await this.adminService.deleteAdmin(id);
            
            res.json(ApiSuccess.deleted('Admin başarıyla silindi'));
        } catch (error) {
            next(error);
        }
    };
}

export default AdminController;