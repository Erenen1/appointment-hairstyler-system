import { Router } from 'express';
import { Express } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import dashboardRoutes from './dashboardRoutes';
import appointmentRoutes from './appointmentRoutes';
import serviceRoutes from './serviceRoutes';
import customerRoutes from './customerRoutes';
import staffRoutes from './staffRoutes';
import reportRoutes from './reportRoutes';
import contentRoutes from './contentRoutes';
import contactRoutes from './contactRoutes';
import { setupSwagger } from './swagger';

const router = Router();

// API versiyonu
const API_VERSION = '/api/v1';

// Health routes (API version dışında)
router.use('/health', healthRoutes);

// Authentication routes
router.use(`${API_VERSION}/auth`, authRoutes);

// API routes (versiyonlu)
router.use(`${API_VERSION}/admin`, adminRoutes);
router.use(`${API_VERSION}/dashboard`, dashboardRoutes);
router.use(`${API_VERSION}/appointments`, appointmentRoutes);
router.use(`${API_VERSION}/services`, serviceRoutes);
router.use(`${API_VERSION}/customers`, customerRoutes);
router.use(`${API_VERSION}/staff`, staffRoutes);

// Yeni eklenen route'lar
router.use(`${API_VERSION}/reports`, reportRoutes);
router.use(`${API_VERSION}/content`, contentRoutes);
router.use(`${API_VERSION}/contact`, contactRoutes);

// Swagger kurulumu fonksiyonu export et
export { setupSwagger };
export default router; 