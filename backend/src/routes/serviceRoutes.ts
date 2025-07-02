import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory
} from '../controllers/serviceController';

const router = Router();

// Hizmet yönetimi rotaları
router.get('/', getServices); // Herkese açık - frontend için
router.get('/categories', getServiceCategories); // Herkese açık - frontend için
router.get('/:id', getServiceById); // Herkese açık - frontend için

// Admin only routes
router.post('/', requireAuth, createService);
router.put('/:id', requireAuth, updateService);
router.delete('/:id', requireAuth, deleteService);

router.post('/categories', requireAuth, createServiceCategory);
router.put('/categories/:id', requireAuth, updateServiceCategory);
router.delete('/categories/:id', requireAuth, deleteServiceCategory);

export default router; 