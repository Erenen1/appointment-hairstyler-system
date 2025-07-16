import { Model, ModelCtor, WhereOptions } from 'sequelize';

export abstract class BaseRepository<T> {
    protected model: ModelCtor<Model>;

    constructor(model: ModelCtor<Model>) {
        this.model = model;
    }

    /**
     * Tüm kayıtları getirir
     */
    public async findAll(options: any = {}): Promise<T[]> {
        const records = await this.model.findAll(options);
        return records.map(record => record.toJSON() as unknown as T);
    }

    /**
     * ID'ye göre kayıt getirir
     */
    public async findById(id: string | number): Promise<T | null> {
        const record = await this.model.findByPk(id);
        return record ? (record.toJSON() as unknown as T) : null;
    }

    /**
     * Belirli koşullara göre kayıt getirir
     */
    public async findOne(conditions: any): Promise<T | null> {
        const where = conditions.where || conditions;
        const record = await this.model.findOne({ where });
        return record ? (record.toJSON() as unknown as T) : null;
    }

    /**
     * Belirli koşullara göre kayıtları getirir
     */
    public async findWhere(conditions: any, options: any = {}): Promise<T[]> {
        const where = conditions.where || conditions;
        const records = await this.model.findAll({
            where,
            ...options
        });
        return records.map(record => record.toJSON() as unknown as T);
    }

    /**
     * Yeni kayıt oluşturur
     */
    public async create(data: Partial<T>): Promise<T> {
        const record = await this.model.create(data as any);
        return record.toJSON() as unknown as T;
    }

    /**
     * Kayıt günceller
     */
    public async update(id: string | number, data: Partial<T>): Promise<T | null> {
        const record = await this.model.findByPk(id);
        if (!record) {
            return null;
        }
        
        await record.update(data as any);
        return record.toJSON() as unknown as T;
    }

    /**
     * Belirli koşullara göre kayıtları günceller
     */
    public async updateWhere(conditions: any, data: Partial<T>): Promise<number> {
        const where = conditions.where || conditions;
        const [affectedCount] = await this.model.update(data as any, { where });
        return affectedCount;
    }

    /**
     * Kayıt siler
     */
    public async delete(id: string | number): Promise<boolean> {
        const affectedRows = await this.model.destroy({ where: { id } as any });
        return affectedRows > 0;
    }

    /**
     * Belirli koşullara göre kayıtları siler
     */
    public async deleteWhere(conditions: any): Promise<number> {
        const where = conditions.where || conditions;
        return await this.model.destroy({ where });
    }

    /**
     * Kayıt sayısını getirir
     */
    public async count(conditions: any = {}): Promise<number> {
        const where = conditions.where || conditions;
        return await this.model.count({ where });
    }

    /**
     * Sayfalama ile kayıtları getirir
     */
    public async paginate(page: number = 1, limit: number = 10, options: any = {}): Promise<{ rows: T[], count: number }> {
        const offset = (page - 1) * limit;
        
        const { rows, count } = await this.model.findAndCountAll({
            ...options,
            limit,
            offset
        });
        
        return {
            rows: rows.map(record => record.toJSON() as unknown as T),
            count
        };
    }
} 