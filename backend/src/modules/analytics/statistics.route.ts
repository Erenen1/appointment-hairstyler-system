import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import StatisticsRepository from './statistics.repository';
import StatisticsService from './statistics.service';
import StatisticsController from './statistics.controller';

const router = Router();
const repo = new StatisticsRepository();
const service = new StatisticsService(repo);
const controller = new StatisticsController(service);

// /api/analytics
router.get('/summary', requireAuth, controller.summary);
router.get('/timeseries', requireAuth, controller.timeseries);
router.get('/breakdowns', requireAuth, controller.breakdowns);

// /api/dashboard
router.get('/dashboard/summary', requireAuth, controller.dashboardSummary);
router.get('/dashboard/top-properties', requireAuth, controller.dashboardTopProperties);
router.get('/dashboard/upcoming-appointments', requireAuth, controller.dashboardUpcomingAppointments);
router.get('/dashboard/financial-overview', requireAuth, controller.dashboardFinancialOverview);

export default router;


