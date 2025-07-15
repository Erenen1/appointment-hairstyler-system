import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../../utils';
import { BaseService } from './base.service';

export abstract class BaseController<T, CreateDto, UpdateDto> {
    protected service: BaseService<T, CreateDto, UpdateDto>;
    protected entityName: string;

    constructor(service: BaseService<T, CreateDto, UpdateDto>, entityName: string) {
        this.service = service;
        this.entityName = entityName;
    }

    /**
     * Tüm kayıtları listeler
     */
    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const entities = await this.service.getAll();
            res.json(ApiSuccess.list(entities, null, `${this.entityName}ler başarıyla listelendi`));
        } catch (error) {
            next(error);
        }
    };

    /**
     * ID'ye göre kayıt detaylarını getirir
     */
    public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const entity = await this.service.getById(id);
            
            if (!entity) {
                throw ApiError.notFound(`${this.entityName} bulunamadı`);
            }
            
            res.json(ApiSuccess.item(entity, `${this.entityName} detayları başarıyla getirildi`));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Yeni kayıt oluşturur
     */
    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dto = req.body as CreateDto;
            const entity = await this.service.create(dto);
            
            res.status(201).json(ApiSuccess.created(entity, `${this.entityName} başarıyla oluşturuldu`));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Kayıt günceller
     */
    public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const dto = req.body as UpdateDto;
            
            const updatedEntity = await this.service.update(id, dto);
            
            res.json(ApiSuccess.updated(updatedEntity, `${this.entityName} bilgileri başarıyla güncellendi`));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Kayıt siler
     */
    public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            
            await this.service.delete(id);
            
            res.json(ApiSuccess.deleted(`${this.entityName} başarıyla silindi`));
        } catch (error) {
            next(error);
        }
    };

    /**
     * Sayfalama ile kayıtları listeler
     */
    public paginate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { page = 1, limit = 10 } = req.query;
            
            const { rows, pagination } = await this.service.paginate(
                Number(page), 
                Number(limit)
            );
            
            res.json(ApiSuccess.list(rows, pagination, `${this.entityName}ler başarıyla listelendi`));
        } catch (error) {
            next(error);
        }
    };
} 