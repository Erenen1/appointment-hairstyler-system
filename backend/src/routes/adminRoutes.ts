import { Router } from 'express';
import { requireSuperAdminApiKey } from '../middleware/authMiddleware';
import * as adminController from '../controllers/adminController';
const router = Router();
router.post('/super/create', requireSuperAdminApiKey, adminController.createAdminWithApiKey);
import '../swagger/paths/admin';
export default router; 