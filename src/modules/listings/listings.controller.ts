import { Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import ListingsService from './listings.service';
import { AuthRequest } from '../../middleware/auth';

export class ListingsController {
  constructor(private readonly service: ListingsService) {}

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const result = await this.service.list(tenantId, req.query as any);
      const pagination = {
        currentPage: result.pagination.page,
        itemsPerPage: result.pagination.pageSize,
        totalItems: result.pagination.total,
        totalPages: Math.ceil(result.pagination.total / result.pagination.pageSize),
      };
      res.json(ApiSuccess.list(result.items, pagination));
    } catch (err) { next(err); }
  };
  get = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.get(req.user?.tenantId as string, req.params.id); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.create(req.user?.tenantId as string, req.body); res.status(201).json(ApiSuccess.created(data)); } catch (err) { next(err); }
  };
  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.update(req.user?.tenantId as string, req.params.id, req.body); res.json(ApiSuccess.updated(data)); } catch (err) { next(err); }
  };
  remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { await this.service.remove(req.user?.tenantId as string, req.params.id); res.json(ApiSuccess.deleted()); } catch (err) { next(err); }
  };

  addImages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.addImages(req.user?.tenantId as string, req.params.id, req.body?.images || []); res.json(ApiSuccess.item({ items: data })); } catch (err) { next(err); }
  };
  setTags = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.setTags(req.user?.tenantId as string, req.params.id, req.body?.tags || []); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  setAmenities = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.setAmenities(req.user?.tenantId as string, req.params.id, req.body?.names || []); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  listEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.listEvents(req.user?.tenantId as string, req.params.id, req.query?.type as string | undefined); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  addEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.addEvent(req.user?.tenantId as string, req.params.id, req.body, req.user?.userId); res.status(201).json(ApiSuccess.created(data)); } catch (err) { next(err); }
  };
}

export default ListingsController;


