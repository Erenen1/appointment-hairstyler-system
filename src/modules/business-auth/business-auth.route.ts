import { Router } from 'express';
import BusinessAuthController from './business-auth.controller';
// Middleware dosyası mevcut olmadığından kaldırıldı; ileride eklendiğinde geri alınabilir
import BusinessAuthRepository from './business-auth.repository';
import BusinessAuthService from './business-auth.service';



class BusinessAuthRoutes {
  private router: Router;
  private businessAuthController: BusinessAuthController;

  constructor() {
    const businessAuthRepository = new BusinessAuthRepository();
    const businessAuthService = new BusinessAuthService(businessAuthRepository);
    const businessAuthController = new BusinessAuthController(businessAuthService);
    
    this.router = Router();
    this.businessAuthController = businessAuthController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.businessAuthController.register);
    this.router.post('/login', this.businessAuthController.login);
    this.router.get('/verify', this.businessAuthController.verifyToken);

    this.router.get('/me', this.businessAuthController.getProfile);
    this.router.put('/me', this.businessAuthController.updateProfile);
    this.router.put('/change-password', this.businessAuthController.changePassword);
    this.router.get('/dashboard', this.businessAuthController.getDashboard);
  }

  /**
   * Router'ı döndürür
   */
  public getRouter(): Router {
    return this.router;
  }
}

export default new BusinessAuthRoutes().getRouter(); 