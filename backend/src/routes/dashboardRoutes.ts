import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware';
import * as dashboardController from '../controllers/dashboardController';

const router = Router();

/**
 * Dashboard Routes
 * Tüm endpoints admin yetkilendirmesi gerektirir
 */

// GET /api/v1/dashboard/stats - Dashboard ana istatistikleri
router.get('/stats', requireAdmin, dashboardController.getDashboardStats);

// GET /api/v1/dashboard/revenue-chart - Gelir grafiği verileri
router.get('/revenue-chart', requireAdmin, dashboardController.getRevenueChart);

// GET /api/v1/dashboard/popular-services - Popüler hizmetler
router.get('/popular-services', requireAdmin, dashboardController.getPopularServices);

// GET /api/v1/dashboard/recent-appointments - Son randevular
router.get('/recent-appointments', requireAdmin, dashboardController.getRecentAppointments);

export default router; 