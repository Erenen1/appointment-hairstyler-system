import { Router } from 'express';
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  getAvailableSlots,
  getAvailableSlotsRange
} from '../controllers/staffController';
import { requireAdmin } from '../middleware/authMiddleware';
import { uploadSingleProfileImage } from '../config/multer';

const router = Router();

router.get('/', getStaff);
router.get('/:id', getStaffById);
router.post('/', requireAdmin, uploadSingleProfileImage, createStaff);
router.put('/:id', requireAdmin, uploadSingleProfileImage, updateStaff);
router.get('/:id/available-slots', getAvailableSlots);
router.get('/:id/available-slots-range', getAvailableSlotsRange);

export default router; 