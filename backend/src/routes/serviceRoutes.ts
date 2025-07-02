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
router.get('/', getServices); 
router.get('/categories', getServiceCategories); 
router.get('/:id', getServiceById); 
router.post('/', requireAuth, createService);
router.put('/:id', requireAuth, updateService);
router.delete('/:id', requireAuth, deleteService);
router.post('/categories', requireAuth, createServiceCategory);
router.put('/categories/:id', requireAuth, updateServiceCategory);
router.delete('/categories/:id', requireAuth, deleteServiceCategory);
export default router; 