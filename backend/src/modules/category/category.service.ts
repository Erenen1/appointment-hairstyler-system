import { ICategory } from "./category.interface";
import CategoryRepository from "./category.repository";
import { CategoryCreateDTO, CategoryUpdateDTO } from "./dto";
import { ApiError } from "../../utils";


class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }


    public async getAllCategories(isActive?: boolean): Promise<ICategory[]> {
        return await this.categoryRepository.getAllCategories(isActive);
    }

    /**
     * ID'ye göre kategori getirir
     * @param id Kategori ID
     * @returns Kategori
     */
    public async getCategoryById(id: string): Promise<ICategory> {
        const category = await this.categoryRepository.getCategoryById(id);

        if (!category) {
            throw ApiError.notFound('Kategori bulunamadı');
        }

        return category;
    }

    /**
     * Yeni kategori oluşturur
     * @param categoryDto Kategori bilgileri
     * @param file Yüklenen resim dosyası
     * @param req Express isteği
     * @returns Oluşturulan kategori
     */
    public async createCategory(categoryDto: CategoryCreateDTO, req: any): Promise<ICategory> {
        const existingCategory = await this.categoryRepository.findCategoryByName(categoryDto.name);
        if (existingCategory) {
            throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
        }

        const category = await this.categoryRepository.createCategory({
            ...categoryDto,
            businessId: req.user.businessId, 
            isActive: categoryDto.isActive !== undefined ? categoryDto.isActive : true,
            orderIndex: categoryDto.orderIndex || 0,
        } as ICategory);

        return category;
    }


    public async updateCategory(id: string, categoryDto: CategoryUpdateDTO, req: any): Promise<ICategory> {
        const existingCategory = await this.categoryRepository.getCategoryById(id);
        if (!existingCategory) {
            throw ApiError.notFound('Kategori bulunamadı');
        }

        if (categoryDto.name && categoryDto.name !== existingCategory.name) {
            const categoryWithSameName = await this.categoryRepository.findCategoryByName(categoryDto.name);
            if (categoryWithSameName && categoryWithSameName.id !== id) {
                throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
            }
        }


        const updatedCategory = await this.categoryRepository.updateCategory(id, {
            ...categoryDto,
        });

        if (!updatedCategory) {
            throw ApiError.internal('Kategori güncellenirken bir hata oluştu');
        }

        return updatedCategory;
    }

    public async deleteCategory(id: string): Promise<void> {

        const category = await this.categoryRepository.getCategoryById(id);
        if (!category) {
            throw ApiError.notFound('Kategori bulunamadı');
        }

        const result = await this.categoryRepository.deleteCategory(id);
        if (!result) {
            throw ApiError.internal('Kategori silinirken bir hata oluştu');
        }
    }
}

export default CategoryService; 