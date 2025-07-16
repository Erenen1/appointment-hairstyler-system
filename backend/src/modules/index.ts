import { Router } from "express";
import adminRoutes from "./admin/admin.route";
import authRoutes from "./auth/auth.route";
import customerRoutes from "./customer/customer.route";
import contactRoutes from "./contact/contact.route";
import staffRoutes from "./staff/staff.route";
import serviceRoutes from "./service/service.route";

/**
 * Tüm modül rotalarını birleştiren ana router
 */
class ModuleRoutes {
    private router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Tüm modül rotalarını initialize eder
     */
    private initializeRoutes(): void {
        // Admin modülü rotaları
        this.router.use("/admin", adminRoutes);
        
        // Auth modülü rotaları
        this.router.use("/auth", authRoutes);
        
        // Customer modülü rotaları
        this.router.use("/customers", customerRoutes);
        
        // Contact modülü rotaları
        this.router.use("/contact", contactRoutes);
        
        // Staff modülü rotaları
        this.router.use("/staff", staffRoutes);
        
        // Service modülü rotaları
        this.router.use("/services", serviceRoutes);
    }

    /**
     * Router'ı döndürür
     * @returns Express Router
     */
    public getRouter(): Router {
        return this.router;
    }
}

export default new ModuleRoutes().getRouter(); 