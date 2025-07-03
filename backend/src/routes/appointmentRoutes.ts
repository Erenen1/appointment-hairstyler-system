import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController';
import { requireAdmin } from '../middleware/authMiddleware';
const router = Router();
router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.get('/calendar', appointmentController.getCalendarAppointments);
router.get('/:id', appointmentController.getAppointmentById);
export default router; 