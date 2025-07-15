import { Router } from 'express';
import adminRoutes from './admin/admin.route';

// Ana router
const router = Router();

// Modül route'larını ana router'a bağla
router.use('/admin', adminRoutes);

// Diğer modüller eklendikçe buraya eklenecek
// router.use('/customer', customerRoutes);
// router.use('/staff', staffRoutes);
// ...

export default router; 