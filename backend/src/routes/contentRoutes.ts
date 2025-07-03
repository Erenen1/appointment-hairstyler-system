import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware';
import {
  getGalleryImages,
  createGalleryImage
} from '../controllers/contentController';
const router = Router();

router.get('/gallery', getGalleryImages);
router.post('/gallery', requireAdmin, createGalleryImage);

export default router; 