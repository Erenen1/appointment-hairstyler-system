import { Router } from 'express';
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  getAvailableSlots
} from '../controllers/staffController';
import { requireAdmin } from '../middleware/authMiddleware';
const router = Router();
router.get('/', getStaff);
router.get('/:id', getStaffById);
router.post('/', requireAdmin, createStaff);
router.put('/:id', requireAdmin, updateStaff);
router.get('/:id/available-slots', getAvailableSlots);
export default router; 