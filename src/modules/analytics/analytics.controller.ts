import { Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import AnalyticsService from './analytics.service';
import { AuthRequest } from '../../middleware/auth';

export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

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

  stats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.stats(req.user?.tenantId as string, req.query as any); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };

  timeseries = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.timeseries(req.user?.tenantId as string, req.query as any); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };

  listEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const items = await this.service.listEvents(req.user?.tenantId as string, req.params.id, req.query?.type as string | undefined); res.json(ApiSuccess.item({ items })); } catch (err) { next(err); }
  };

  addEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.addEvent(req.user?.tenantId as string, req.params.id, req.body, req.user?.userId); res.status(201).json(ApiSuccess.created(data)); } catch (err) { next(err); }
  };
}

export default AnalyticsController;


