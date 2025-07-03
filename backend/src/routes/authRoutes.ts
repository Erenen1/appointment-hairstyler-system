import { Router } from 'express';
import { 
  adminLogin, 
  logout, 
  getCurrentUser, 
} from '../controllers/authController';
import { requireAdmin } from '../middleware/authMiddleware';
const router = Router();

router.post('/admin/login', adminLogin);
router.post('/logout', requireAdmin, logout);
router.get('/profile',requireAdmin, getCurrentUser);

export default router; 