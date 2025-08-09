import { Router } from 'express';
import healthRoutes from './healthRoutes';
import moduleRoutes from '../modules';
import { setupSwagger } from './swagger';

const router = Router();

// Health check rotası
router.use('/health', healthRoutes);

// Yeni modül sistemindeki tüm rotalar
router.use('/api', moduleRoutes);

export { setupSwagger };
export default router; 