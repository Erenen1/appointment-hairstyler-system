import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
import {
  getGalleryImages,
  createGalleryImage
} from '../controllers/contentController';
const router = Router();
router.get('/gallery', getGalleryImages);
router.post('/gallery', requireAuth, requireAdmin, createGalleryImage);
export default router; 