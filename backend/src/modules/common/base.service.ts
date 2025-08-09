import { BaseRepository } from './base.repository';
import { ApiError } from '../../utils';

export abstract class BaseService<T, CreateDto, UpdateDto> {
    protected repository: BaseRepository<T>;
    protected entityName: string;

    constructor(repository: BaseRepository<T>, entityName: string) {
        this.repository = repository;
        this.entityName = entityName;
    }

    /**
     * Tüm kayıtları getirir
     */
    public async getAll(options: any = {}): Promise<T[]> {
        return await this.repository.findAll(options);
    }

    /**
     * ID'ye göre kayıt getirir
     */
    public async getById(id: string | number): Promise<T | null> {
        return await this.repository.findById(id);
    }

    /**
     * Yeni kayıt oluşturur
     */
    public async create(data: CreateDto): Promise<T> {
        return await this.repository.create(data as any);
    }

    /**
     * Kayıt günceller
     */
    public async update(id: string | number, data: UpdateDto): Promise<T> {
        const entity = await this.repository.findById(id);
        
        if (!entity) {
            throw ApiError.notFound(`${this.entityName} bulunamadı`);
        }
        
        const updatedEntity = await this.repository.update(id, data as any);
        
        if (!updatedEntity) {
            throw ApiError.internal(`${this.entityName} güncellenirken bir hata oluştu`);
        }
        
        return updatedEntity;
    }

    /**
     * Kayıt siler
     */
    public async delete(id: string | number): Promise<void> {
        const entity = await this.repository.findById(id);
        
        if (!entity) {
            throw ApiError.notFound(`${this.entityName} bulunamadı`);
        }
        
        const deleted = await this.repository.delete(id);
        
        if (!deleted) {
            throw ApiError.internal(`${this.entityName} silinirken bir hata oluştu`);
        }
    }

    /**
     * Sayfalama ile kayıtları getirir
     */
    public async paginate(page: number = 1, limit: number = 10, options: any = {}): Promise<{ rows: T[], count: number, pagination: any }> {
        const { rows, count } = await this.repository.paginate(page, limit, options);
        
        const totalPages = Math.ceil(count / limit);
        
        const pagination = {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
        
        return { rows, count, pagination };
    }
} 