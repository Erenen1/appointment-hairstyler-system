import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
import {
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
  getContactStats
} from '../controllers/contactController';
const router = Router();
router.get('/messages', requireAuth, requireAdmin, getContactMessages);
router.get('/messages/:id', requireAuth, requireAdmin, getContactMessageById);
router.put('/messages/:id/status', requireAuth, requireAdmin, updateContactMessageStatus);
router.delete('/messages/:id', requireAuth, requireAdmin, deleteContactMessage);
router.get('/stats', requireAuth, requireAdmin, getContactStats);
export default router; 