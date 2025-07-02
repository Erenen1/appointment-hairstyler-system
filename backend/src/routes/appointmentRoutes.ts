import { Router } from 'express';
import { requireStaffOrAdmin } from '../middleware/authMiddleware';
import * as appointmentController from '../controllers/appointmentController';

const router = Router();

/**
 * Appointment Routes
 * Tüm endpoints staff veya admin yetkilendirmesi gerektirir
 */

// GET /api/v1/appointments - Randevu listesi
router.get('/', requireStaffOrAdmin, appointmentController.getAppointments);

// POST /api/v1/appointments - Yeni randevu oluştur
router.post('/', requireStaffOrAdmin, appointmentController.createAppointment);

// GET /api/v1/appointments/calendar - Takvim görünümü için randevular
router.get('/calendar', requireStaffOrAdmin, appointmentController.getCalendarAppointments);

// GET /api/v1/appointments/:id - Randevu detayı
router.get('/:id', requireStaffOrAdmin, appointmentController.getAppointmentById);

// PUT /api/v1/appointments/:id/status - Randevu durumu güncelle
router.put('/:id/status', requireStaffOrAdmin, appointmentController.updateAppointmentStatus);

export default router; 