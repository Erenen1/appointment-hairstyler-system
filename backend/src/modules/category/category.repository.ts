import { ICategory } from "./category.interface";
import { BaseRepository } from "../common/base.repository";
import db from "../../models";
import { Op } from "sequelize";

const { ServiceCategory } = db;

/**
 * Kategori veritabanı işlemleri için repository sınıfı
 */
class CategoryRepository extends BaseRepository<ICategory> {
    constructor() {
        super(ServiceCategory);
    }

    /**
     * Tüm kategorileri getirir
     * @param isActive Aktiflik durumu filtresi (opsiyonel)
     * @returns Kategori listesi
     */
    public async getAllCategories(isActive?: boolean): Promise<ICategory[]> {
        const where: any = {};
        
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        
        return await ServiceCategory.findAll({
            where,
            order: [['orderIndex', 'ASC']]
        });
    }

    public async getCategoryById(id: string): Promise<ICategory | null> {
        return await ServiceCategory.findByPk(id);
    }


    public async createCategory(category: ICategory): Promise<ICategory> {
        return await ServiceCategory.create(category);
    }

    public async updateCategory(id: string, category: Partial<ICategory>): Promise<ICategory | null> {
        const existingCategory = await ServiceCategory.findByPk(id);
        
        if (!existingCategory) {
            return null;
        }
        
        await existingCategory.update(category);
        return existingCategory;
    }


    public async deleteCategory(id: string): Promise<boolean> {
        const result = await ServiceCategory.destroy({
            where: { id }
        });
        
        return result > 0;
    }


    public async findCategoryByName(name: string): Promise<ICategory | null> {
        return await ServiceCategory.findOne({
            where: {
                name: {
                    [Op.iLike]: name
                }
            }
        });
    }
}

export default CategoryRepository; 