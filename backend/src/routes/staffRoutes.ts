import { Router } from 'express';
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  getAvailableSlots
} from '../controllers/staffController';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
const router = Router();
router.get('/', getStaff);
router.get('/:id', getStaffById);
router.post('/', requireAuth, requireAdmin, createStaff);
router.put('/:id', requireAuth, requireAdmin, updateStaff);
router.get('/:id/available-slots', getAvailableSlots);
export default router; 