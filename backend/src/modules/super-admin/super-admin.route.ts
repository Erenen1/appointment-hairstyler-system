import { Router } from 'express';
import SuperAdminController from './super-admin.controller';
import { requireSuperAdmin } from '../../middleware/businessAuthMiddleware';

/**
 * Super Admin rotalarını yöneten sınıf
 */
class SuperAdminRoutes {
  private router: Router;
  private superAdminController: SuperAdminController;

  constructor() {
    this.router = Router();
    this.superAdminController = new SuperAdminController();
    this.initializeRoutes();
  }

  /**
   * Tüm super admin rotalarını initialize eder
   */
  private initializeRoutes(): void {
    // Public route'lar
    this.router.post('/login', this.superAdminController.login);
    this.router.get('/verify', this.superAdminController.verifyToken);

    // Protected route'lar (Super admin token gerektirir)
    this.router.get('/me', requireSuperAdmin, this.superAdminController.getProfile);
    
    // Business management routes
    this.router.get('/businesses', requireSuperAdmin, this.superAdminController.getBusinesses);
    this.router.get('/businesses/:id', requireSuperAdmin, this.superAdminController.getBusinessById);
    this.router.put('/businesses/:id/toggle-status', requireSuperAdmin, this.superAdminController.toggleBusinessStatus);
  }

  /**
   * Router'ı döndürür
   */
  public getRouter(): Router {
    return this.router;
  }
}

export default new SuperAdminRoutes().getRouter(); 