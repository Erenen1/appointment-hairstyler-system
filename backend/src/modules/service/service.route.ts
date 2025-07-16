import { Router } from "express";
import ServiceController from "./service.controller";
import ServiceService from "./service.service";
import ServiceRepository from "./service.repository";
import { requireAdmin } from "../../middleware/authMiddleware";
import { uploadSingleServiceImage } from "../../config/multer";

/**
 * Hizmet modülü için route tanımlamaları
 */

// Dependency Injection
const serviceRepository = new ServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

const router = Router();

// Hizmet kategorisi rotaları
router.get('/categories', serviceController.getAllServiceCategories.bind(serviceController));
router.get('/categories/:id', serviceController.getServiceCategoryById.bind(serviceController));
router.post('/categories', requireAdmin, uploadSingleServiceImage, serviceController.createServiceCategory.bind(serviceController));
router.put('/categories/:id', requireAdmin, uploadSingleServiceImage, serviceController.updateServiceCategory.bind(serviceController));
router.delete('/categories/:id', requireAdmin, serviceController.deleteServiceCategory.bind(serviceController));

// Hizmet rotaları
router.get('/', serviceController.getAllServices.bind(serviceController));
router.get('/:id', serviceController.getServiceById.bind(serviceController));
router.get('/slug/:slug', serviceController.getServiceBySlug.bind(serviceController));
router.post('/', requireAdmin, uploadSingleServiceImage, serviceController.createService.bind(serviceController));
router.put('/:id', requireAdmin, uploadSingleServiceImage, serviceController.updateService.bind(serviceController));
router.delete('/:id', requireAdmin, serviceController.deleteService.bind(serviceController));

export default router; 