import { Router } from "express";
import businessAuthRoutes from "./business-auth/business-auth.route";
import superAdminRoutes from "./super-admin/super-admin.route";
import customerRoutes from "./customer/customer.route";
import contactRoutes from "./contact/contact.route";
import staffRoutes from "./staff/staff.route";
import serviceRoutes from "./service/service.route";
import categoryRoutes from "./category/category.route";

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
        // Business auth modülü rotaları
        this.router.use("/business-auth", businessAuthRoutes);
        
        // Super admin modülü rotaları
        this.router.use("/super-admin", superAdminRoutes);
        
        // Customer modülü rotaları
        this.router.use("/customers", customerRoutes);
        
        // Contact modülü rotaları
        this.router.use("/contact", contactRoutes);
        
        // Staff modülü rotaları
        this.router.use("/staff", staffRoutes);
        
        // Service modülü rotaları
        this.router.use("/services", serviceRoutes);
        
        // Kategori modülü rotaları
        this.router.use("/categories", categoryRoutes);
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