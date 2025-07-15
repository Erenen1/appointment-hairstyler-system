import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import dashboardRoutes from './dashboardRoutes';
import appointmentRoutes from './appointmentRoutes';
import serviceRoutes from './serviceRoutes';
import customerRoutes from './customerRoutes';
import staffRoutes from './staffRoutes';
import contentRoutes from './contentRoutes';
import contactRoutes from './contactRoutes';
import availabilityRoutes from './availabilityRoutes';
import { setupSwagger } from './swagger';


const router = Router();

router.use('/health', healthRoutes);
router.use(`/auth`, authRoutes);
router.use(`/admin`, adminRoutes);
router.use(`/dashboard`, dashboardRoutes);
router.use(`/appointments`, appointmentRoutes);
router.use(`/services`, serviceRoutes);
router.use(`/customers`, customerRoutes);
router.use(`/staff`, staffRoutes);
router.use(`/content`, contentRoutes);
router.use(`/contact`, contactRoutes);
router.use(`/availability`, availabilityRoutes);


export { setupSwagger };
export default router; 