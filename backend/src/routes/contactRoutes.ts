import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware';
import {
  getContactMessages,
  getContactMessageById,
  deleteContactMessage,
  getContactStats
} from '../controllers/contactController';
const router = Router();
router.get('/messages', requireAdmin, getContactMessages);
router.get('/messages/:id', requireAdmin, getContactMessageById);
router.delete('/messages/:id', requireAdmin, deleteContactMessage);
router.get('/stats', requireAdmin, getContactStats);
export default router; 