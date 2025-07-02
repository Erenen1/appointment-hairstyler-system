import { Router } from 'express';
import { 
  adminLogin, 
  logout, 
  getCurrentUser, 
  checkSession 
} from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
const router = Router();
router.post('/admin/login', adminLogin);
router.post('/logout', requireAuth, logout);
router.get('/me', getCurrentUser);
router.get('/check', checkSession);
import '../swagger/paths/auth';
export default router; 