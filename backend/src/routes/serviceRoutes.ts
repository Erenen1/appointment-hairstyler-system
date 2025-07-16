import { Router } from 'express';
import { requireAdmin } from '../middleware/authMiddleware';
import { uploadSingleServiceImage } from '../config/multer';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  getServiceStaff,
  getServiceStaffAvailability
} from '../controllers/serviceController';
const router = Router();

router.get('/', getServices); 
router.get('/categories', getServiceCategories); 
router.get('/:id', getServiceById); 
router.get('/:id/staff', getServiceStaff);
router.get('/:id/staff/availability', getServiceStaffAvailability);
router.post('/', requireAdmin, uploadSingleServiceImage, createService);
router.put('/:id', requireAdmin, updateService);
router.delete('/:id', requireAdmin, deleteService);
router.post('/categories', requireAdmin, createServiceCategory);
router.put('/categories/:id', requireAdmin, updateServiceCategory);
router.delete('/categories/:id', requireAdmin, deleteServiceCategory);

export default router; 