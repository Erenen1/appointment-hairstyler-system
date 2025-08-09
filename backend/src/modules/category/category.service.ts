import { ICategory } from "./category.interface";
import CategoryRepository from "./category.repository";
import { CategoryCreateDTO, CategoryUpdateDTO } from "./dto";
import { ApiError } from "../../utils";
import path from 'path';
import { generateFileUrl, deleteFile } from "../../config/multer";

/**
 * Kategori işlemleri için servis sınıfı
 */
class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor(categoryRepository: CategoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Tüm kategorileri getirir
     * @param isActive Aktiflik durumu filtresi (opsiyonel)
     * @returns Kategori listesi
     */
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
        // İsim kontrolü
        const existingCategory = await this.categoryRepository.findCategoryByName(categoryDto.name);
        if (existingCategory) {
            throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
        }

        // Kategori oluştur
        const category = await this.categoryRepository.createCategory({
            ...categoryDto,
            isActive: categoryDto.isActive !== undefined ? categoryDto.isActive : true,
            orderIndex: categoryDto.orderIndex || 0,
        } as ICategory);

        return category;
    }

    /**
     * Kategori günceller
     * @param id Kategori ID
     * @param categoryDto Güncellenecek kategori bilgileri
     * @param file Yüklenen resim dosyası
     * @param req Express isteği
     * @returns Güncellenen kategori
     */
    public async updateCategory(id: string, categoryDto: CategoryUpdateDTO, file: Express.Multer.File | undefined, req: any): Promise<ICategory> {
        // Kategori var mı kontrol et
        const existingCategory = await this.categoryRepository.getCategoryById(id);
        if (!existingCategory) {
            throw ApiError.notFound('Kategori bulunamadı');
        }

        // İsim değiştirildi mi ve yeni isim başka bir kategoride var mı kontrol et
        if (categoryDto.name && categoryDto.name !== existingCategory.name) {
            const categoryWithSameName = await this.categoryRepository.findCategoryByName(categoryDto.name);
            if (categoryWithSameName && categoryWithSameName.id !== id) {
                throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
            }
        }


        // Kategoriyi güncelle
        const updatedCategory = await this.categoryRepository.updateCategory(id, {
            ...categoryDto,
        });

        if (!updatedCategory) {
            throw ApiError.internal('Kategori güncellenirken bir hata oluştu');
        }

        return updatedCategory;
    }

    /**
     * Kategori siler
     * @param id Kategori ID
     */
    public async deleteCategory(id: string): Promise<void> {
        // Kategori var mı kontrol et
        const category = await this.categoryRepository.getCategoryById(id);
        if (!category) {
            throw ApiError.notFound('Kategori bulunamadı');
        }

        // Kategoriyi sil
        const result = await this.categoryRepository.deleteCategory(id);
        if (!result) {
            throw ApiError.internal('Kategori silinirken bir hata oluştu');
        }
    }
}

export default CategoryService; 