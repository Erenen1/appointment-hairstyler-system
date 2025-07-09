"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const multer_1 = require("../config/multer");
const serviceController_1 = require("../controllers/serviceController");
const router = (0, express_1.Router)();
router.get('/', serviceController_1.getServices);
router.get('/categories', serviceController_1.getServiceCategories);
router.get('/:id', serviceController_1.getServiceById);
router.get('/:id/staff', serviceController_1.getServiceStaff);
router.post('/', authMiddleware_1.requireAdmin, multer_1.uploadSingleServiceImage, serviceController_1.createService);
router.put('/:id', authMiddleware_1.requireAdmin, serviceController_1.updateService);
router.delete('/:id', authMiddleware_1.requireAdmin, serviceController_1.deleteService);
router.post('/categories', authMiddleware_1.requireAdmin, serviceController_1.createServiceCategory);
router.put('/categories/:id', authMiddleware_1.requireAdmin, serviceController_1.updateServiceCategory);
router.delete('/categories/:id', authMiddleware_1.requireAdmin, serviceController_1.deleteServiceCategory);
exports.default = router;
//# sourceMappingURL=serviceRoutes.js.map