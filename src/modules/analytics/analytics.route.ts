import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import AnalyticsRepository from './analytics.repository';
import AnalyticsService from './analytics.service';
import AnalyticsController from './analytics.controller';

const router = Router();
const repo = new AnalyticsRepository();
const service = new AnalyticsService(repo);
const controller = new AnalyticsController(service);

router.get('/list', requireAuth, controller.list);
router.get('/stats', requireAuth, controller.stats);
router.get('/timeseries', requireAuth, controller.timeseries);
router.get('/properties/:id/events', requireAuth, controller.listEvents);
router.post('/properties/:id/events', requireAuth, controller.addEvent);

export default router;


