import { Router } from 'express';
import { requireSuperAdminApiKey } from '../middleware/authMiddleware';
import * as adminController from '../controllers/adminController';

const router = Router();

/**
 * Admin Management Routes
 * Super Admin API Key ile erişilebilir endpoints
 */

// POST /api/v1/admin/super/create - Super admin ile admin oluşturma (API key gerekli)
router.post('/super/create', requireSuperAdminApiKey, adminController.createAdminWithApiKey);

// Import swagger path definitions
import '../swagger/paths/admin';

export default router; 