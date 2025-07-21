import { Router } from 'express';
import BusinessAuthController from './business-auth.controller';
import { requireBusiness, applyBusinessContext } from '../../middleware/businessAuthMiddleware';

/**
 * Business authentication rotalarını yöneten sınıf
 */
class BusinessAuthRoutes {
  private router: Router;
  private businessAuthController: BusinessAuthController;

  constructor() {
    this.router = Router();
    this.businessAuthController = new BusinessAuthController();
    this.initializeRoutes();
  }

  /**
   * Tüm business auth rotalarını initialize eder
   */
  private initializeRoutes(): void {
    // Public route'lar (authentication gerektirmez)
    this.router.post('/register', this.businessAuthController.register);
    this.router.post('/login', this.businessAuthController.login);
    this.router.post('/logout', this.businessAuthController.logout);
    this.router.get('/verify', this.businessAuthController.verifyToken);

    // Protected route'lar (JWT token gerektirir)
    this.router.get('/me', requireBusiness, applyBusinessContext, this.businessAuthController.getProfile);
    this.router.put('/me', requireBusiness, applyBusinessContext, this.businessAuthController.updateProfile);
    this.router.put('/change-password', requireBusiness, applyBusinessContext, this.businessAuthController.changePassword);
    this.router.get('/dashboard', requireBusiness, applyBusinessContext, this.businessAuthController.getDashboard);
  }

  /**
   * Router'ı döndürür
   */
  public getRouter(): Router {
    return this.router;
  }
}

export default new BusinessAuthRoutes().getRouter(); 