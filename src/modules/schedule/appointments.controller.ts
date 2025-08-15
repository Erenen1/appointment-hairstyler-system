import { Request, Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import AppointmentsService from './appointments.service';
import { AuthRequest } from '../../middleware/auth';

export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  list = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.list(req.user?.userId as string, req.query as any);
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
    try {
      const data = await this.service.get(req.user?.userId as string, req.params.id);
      res.json(ApiSuccess.item(data));
    } catch (err) { next(err); }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.user?.userId as string, req.body);
      res.status(201).json(ApiSuccess.created(data));
    } catch (err) { next(err); }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.update(req.user?.userId as string, req.params.id, req.body);
      res.json(ApiSuccess.updated(data));
    } catch (err) { next(err); }
  };

  remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.remove(req.user?.userId as string, req.params.id);
      res.json(ApiSuccess.deleted());
    } catch (err) { next(err); }
  };

  getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.history(req.params.id); res.json(ApiSuccess.item({ items: data })); } catch (err) { next(err); }
  };
  addHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const { toStatusId, note } = req.body as { toStatusId: string; note?: string };
      const items = await this.service.addHistory(req.params.id, toStatusId, userId, note);
      res.json(ApiSuccess.item({ items }));
    } catch (err) { next(err); }
  };

  // helpers
  services = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const items = await this.service.listServices(req.user?.userId as string); res.json(ApiSuccess.item({ items })); } catch (err) { next(err); }
  };
  staff = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const items = await this.service.listStaff(req.user?.userId as string); res.json(ApiSuccess.item({ items })); } catch (err) { next(err); }
  };
  statuses = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const items = await this.service.listStatuses(req.user?.userId as string); res.json(ApiSuccess.item({ items })); } catch (err) { next(err); }
  };
}

export default AppointmentsController;


