import { Response, NextFunction } from 'express';
import { ApiSuccess } from '../../utils/ApiResponse';
import StatisticsService from './statistics.service';
import { AuthRequest } from '../../middleware/auth';

export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  summary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.summary(req.user?.tenantId as string); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  timeseries = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.timeseries(req.user?.tenantId as string, req.query as any); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  breakdowns = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.breakdowns(req.user?.tenantId as string, req.query as any); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };

  // dashboard
  dashboardSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const data = await this.service.dashboardSummary(req.user?.tenantId as string, (req.query as any).range); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  dashboardTopProperties = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const { limit, range, sort } = req.query as any; const data = await this.service.dashboardTopProperties(req.user?.tenantId as string, Number(limit)||5, range, sort); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  dashboardUpcomingAppointments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const { limit, from, staffId } = req.query as any; const data = await this.service.dashboardUpcomingAppointments(req.user?.tenantId as string, Number(limit)||5, from, staffId); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
  dashboardFinancialOverview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try { const { range } = req.query as any; const data = await this.service.dashboardFinancialOverview(req.user?.tenantId as string, range); res.json(ApiSuccess.item(data)); } catch (err) { next(err); }
  };
}

export default StatisticsController;


