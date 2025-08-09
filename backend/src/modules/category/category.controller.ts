import { NextFunction, Request, Response } from "express";
import CategoryService from "./category.service";
import { ApiSuccess, ApiError } from "../../utils";
import { CategoryCreateDTO, CategoryUpdateDTO } from "./dto";

/**
 * Kategori işlemleri için controller sınıfı
 */
class CategoryController {
    private categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Tüm kategorileri listeler
     */
    public getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { isActive } = req.query;
            const categories = await this.categoryService.getAllCategories(
                isActive !== undefined ? isActive === 'true' : undefined
            );
            res.json(ApiSuccess.list(categories, null, 'Kategoriler başarıyla listelendi'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * ID'ye göre kategori detaylarını getirir
     */
    public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategoryById(id);
            res.json(ApiSuccess.item(category, 'Kategori detayları başarıyla getirildi'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Yeni kategori oluşturur
     */
    public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categoryDto = req.body as CategoryCreateDTO;
            
            const category = await this.categoryService.createCategory(categoryDto, req);
            
            res.status(201).json(ApiSuccess.created(category, 'Kategori başarıyla oluşturuldu'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Kategori günceller
     */
    public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const categoryDto = req.body as CategoryUpdateDTO;
            const file = req.file;
            
            const updatedCategory = await this.categoryService.updateCategory(id, categoryDto, file, req);
            
            res.json(ApiSuccess.updated(updatedCategory, 'Kategori bilgileri başarıyla güncellendi'));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Kategori siler
     */
    public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            
            await this.categoryService.deleteCategory(id);
            
            res.json(ApiSuccess.deleted('Kategori başarıyla silindi'));
        } catch (error) {
            next(error);
        }
    };
}

export default CategoryController; 