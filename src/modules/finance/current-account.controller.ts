import { Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import CurrentAccountService from './current-account.service';
import { AuthRequest } from '../../middleware/auth';

export class CurrentAccountController {
  constructor(private readonly service: CurrentAccountService) {}

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId as string;
      const result = await this.service.list(tenantId, req.query as any, req.user?.userId);
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
    try { const data = await this.service.get(req.user?.tenantId as string, req.params.id, req.user?.userId); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.create(req.user?.tenantId as string, req.body, req.user?.userId); res.status(201).json(ApiSuccess.created(data)); } catch (err) { next(err); }
  };
  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.update(req.user?.tenantId as string, req.params.id, req.body, req.user?.userId); res.json(ApiSuccess.updated(data)); } catch (err) { next(err); }
  };
  remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { await this.service.remove(req.user?.tenantId as string, req.params.id, req.user?.userId); res.json(ApiSuccess.deleted()); } catch (err) { next(err); }
  };

  listTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize, sort } = req.query as any;
      const result = await this.service.listTransactions(req.params.id, Number(page), Number(pageSize), sort);
      const pagination = {
        currentPage: result.pagination.page,
        itemsPerPage: result.pagination.pageSize,
        totalItems: result.pagination.total,
        totalPages: Math.ceil(result.pagination.total / result.pagination.pageSize),
      };
      res.json(ApiSuccess.list(result.items, pagination));
    } catch (err) { next(err); }
  };
  addTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { await this.service.addTransaction(req.params.id, req.body); res.status(201).json(ApiSuccess.created({ ok: true })); } catch (err) { next(err); }
  };
  removeTransaction = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { await this.service.removeTransaction(req.params.txId); res.json(ApiSuccess.deleted()); } catch (err) { next(err); }
  };
}

export default CurrentAccountController;


