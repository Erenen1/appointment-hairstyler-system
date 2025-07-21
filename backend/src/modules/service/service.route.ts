import { Router } from "express";
import ServiceController from "./service.controller";
import ServiceService from "./service.service";
import ServiceRepository from "./service.repository";
import { requireBusinessOrAdmin, applyBusinessContext } from "../../middleware/businessAuthMiddleware";
import { uploadSingleServiceImage } from "../../config/multer";

/**
 * Hizmet modülü için route tanımlamaları
 */

// Dependency Injection
const serviceRepository = new ServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

const router = Router();

// Hizmet kategorisi rotaları (Business context gerektirir)
router.get('/categories', requireBusinessOrAdmin, applyBusinessContext, serviceController.getAllServiceCategories.bind(serviceController));
router.get('/categories/:id', requireBusinessOrAdmin, applyBusinessContext, serviceController.getServiceCategoryById.bind(serviceController));
router.post('/categories', requireBusinessOrAdmin, applyBusinessContext, uploadSingleServiceImage, serviceController.createServiceCategory.bind(serviceController));
router.put('/categories/:id', requireBusinessOrAdmin, applyBusinessContext, uploadSingleServiceImage, serviceController.updateServiceCategory.bind(serviceController));
router.delete('/categories/:id', requireBusinessOrAdmin, applyBusinessContext, serviceController.deleteServiceCategory.bind(serviceController));

// Hizmet rotaları (Business context gerektirir)
router.get('/', requireBusinessOrAdmin, applyBusinessContext, serviceController.getAllServices.bind(serviceController));
router.get('/:id', requireBusinessOrAdmin, applyBusinessContext, serviceController.getServiceById.bind(serviceController));
router.get('/slug/:slug', requireBusinessOrAdmin, applyBusinessContext, serviceController.getServiceBySlug.bind(serviceController));
router.post('/', requireBusinessOrAdmin, applyBusinessContext, uploadSingleServiceImage, serviceController.createService.bind(serviceController));
router.put('/:id', requireBusinessOrAdmin, applyBusinessContext, uploadSingleServiceImage, serviceController.updateService.bind(serviceController));
router.delete('/:id', requireBusinessOrAdmin, applyBusinessContext, serviceController.deleteService.bind(serviceController));

export default router; 