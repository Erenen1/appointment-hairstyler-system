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

/**
 * @swagger
 * /api/v1/reports/revenue:
 *   get:
 *     summary: Gelir raporu getir
 *     tags: [Reports]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Başlangıç tarihi
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Bitiş tarihi
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: day
 *         description: Gruplama türü
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: integer
 *         description: Personel ID (opsiyonel)
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: integer
 *         description: Hizmet ID (opsiyonel)
 *     responses:
 *       200:
 *         description: Gelir raporu başarıyla getirildi
 *       400:
 *         description: Geçersiz parametreler
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Erişim reddedildi
 */
router.get('/revenue', requireAuth, requireAdmin, getRevenueReport);

/**
 * @swagger
 * /api/v1/reports/appointments:
 *   get:
 *     summary: Randevu raporu getir
 *     tags: [Reports]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Randevu raporu başarıyla getirildi
 */
router.get('/appointments', requireAuth, requireAdmin, getAppointmentReport);

/**
 * @swagger
 * /api/v1/reports/customers:
 *   get:
 *     summary: Müşteri raporu getir
 *     tags: [Reports]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *           default: month
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Müşteri raporu başarıyla getirildi
 */
router.get('/customers', requireAuth, requireAdmin, getCustomerReport);

/**
 * @swagger
 * /api/v1/reports/popular-services:
 *   get:
 *     summary: Popüler hizmetler raporu getir
 *     tags: [Reports]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Popüler hizmetler raporu başarıyla getirildi
 */
router.get('/popular-services', requireAuth, requireAdmin, getPopularServicesReport);

/**
 * @swagger
 * /api/v1/reports/staff-performance:
 *   get:
 *     summary: Personel performans raporu getir
 *     tags: [Reports]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: staffId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Personel performans raporu başarıyla getirildi
 */
router.get('/staff-performance', requireAuth, requireAdmin, getStaffPerformanceReport);

export default router; 