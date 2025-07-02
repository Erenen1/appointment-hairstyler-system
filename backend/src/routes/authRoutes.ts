import { Router } from 'express';
import { 
  adminLogin, 
  logout, 
  getCurrentUser, 
  checkSession 
} from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Kimlik Doğrulama
 *   description: Admin kimlik doğrulama işlemleri
 */

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin giriş işlemi
 * @access  Public
 */
router.post('/admin/login', adminLogin);

/**
 * @route   POST /api/auth/logout
 * @desc    Çıkış işlemi
 * @access  Private
 */
router.post('/logout', requireAuth, logout);

/**
 * @route   GET /api/auth/me
 * @desc    Mevcut kullanıcı bilgilerini getir
 * @access  Private
 */
router.get('/me', getCurrentUser);

/**
 * @route   GET /api/auth/check
 * @desc    Session durumunu kontrol et
 * @access  Public
 */
router.get('/check', checkSession);

// Import swagger path definitions
import '../swagger/paths/auth';

export default router; 