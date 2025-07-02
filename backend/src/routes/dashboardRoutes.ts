import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware';
import * as dashboardController from '../controllers/dashboardController';
const router = Router();
router.get('/stats', requireAdmin, dashboardController.getDashboardStats);
router.get('/revenue-chart', requireAdmin, dashboardController.getRevenueChart);
router.get('/popular-services', requireAdmin, dashboardController.getPopularServices);
router.get('/recent-appointments', requireAdmin, dashboardController.getRecentAppointments);
export default router; 