import { Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import IncomeService from './income.service';
import { AuthRequest } from '../../middleware/auth';

export class IncomeController {
  constructor(private readonly service: IncomeService) {}

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

  // categories
  listCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const items = await this.service.listCategories(req.user?.tenantId as string); res.json(ApiSuccess.item({ items })); } catch (err) { next(err); }
  };
  createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.createCategory(req.user?.tenantId as string, req.body); res.status(201).json(ApiSuccess.created(data)); } catch (err) { next(err); }
  };
  updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.updateCategory(req.user?.tenantId as string, req.params.id, req.body); res.json(ApiSuccess.updated(data)); } catch (err) { next(err); }
  };
  removeCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { await this.service.removeCategory(req.user?.tenantId as string, req.params.id); res.json(ApiSuccess.deleted()); } catch (err) { next(err); }
  };
}

export default IncomeController;


