import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
import {
  getRevenueReport,
  getAppointmentReport,
  getCustomerReport,
  getPopularServicesReport,
  getStaffPerformanceReport
} from '../controllers/reportController';
const router = Router();
router.get('/revenue', requireAuth, requireAdmin, getRevenueReport);
router.get('/appointments', requireAuth, requireAdmin, getAppointmentReport);
router.get('/customers', requireAuth, requireAdmin, getCustomerReport);
router.get('/popular-services', requireAuth, requireAdmin, getPopularServicesReport);
router.get('/staff-performance', requireAuth, requireAdmin, getStaffPerformanceReport);
export default router; 