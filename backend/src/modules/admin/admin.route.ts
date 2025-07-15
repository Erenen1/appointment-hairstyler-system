import { Router } from 'express';
import { requireSuperAdminApiKey } from '../../middleware/authMiddleware';
import AdminController from './admin.controller';
import AdminService from './admin.service';
import AdminRepository from './admin.repostory';

// Dependency injection
const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const router = Router();

// Super admin routes
router.post('/super/create', requireSuperAdminApiKey, adminController.createAdminWithApiKey);

// Admin management routes
router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.post('/:id/change-password', adminController.changePassword);
router.delete('/:id', adminController.deleteAdmin);

export default router;
