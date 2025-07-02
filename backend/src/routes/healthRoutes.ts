import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();

/**
 * @route   GET /health
 * @desc    Genel sistem sağlık durumu
 * @access  Public
 */
router.get('/', HealthController.getSystemHealth);

/**
 * @route   GET /health/database
 * @desc    Database sağlık durumu
 * @access  Public
 */
router.get('/database', HealthController.getDatabaseHealth);

/**
 * @route   GET /health/server
 * @desc    Server bilgileri
 * @access  Public
 */
router.get('/server', HealthController.getServerInfo);

/**
 * @route   GET /health/liveness
 * @desc    Liveness probe (Kubernetes)
 * @access  Public
 */
router.get('/liveness', HealthController.liveness);

/**
 * @route   GET /health/readiness
 * @desc    Readiness probe (Kubernetes)
 * @access  Public
 */
router.get('/readiness', HealthController.readiness);

// Import swagger path definitions
import '../swagger/paths/health';

export default router; 