import { Router } from "express";
import StaffController from "./staff.controller";
import StaffService from "./staff.service";
import StaffRepository from "./staff.repository";
import { requireBusinessOrAdmin, applyBusinessContext } from "../../middleware/businessAuthMiddleware";
import { uploadSingleProfileImage } from "../../config/multer";

/**
 * Personel modülü için route tanımlamaları
 */

// Dependency Injection
const staffRepository = new StaffRepository();
const staffService = new StaffService(staffRepository);
const staffController = new StaffController(staffService);

const router = Router();

// Routes (Business context gerektirir)
router.get('/', requireBusinessOrAdmin, applyBusinessContext, staffController.getAllStaff.bind(staffController));
router.get('/:id', requireBusinessOrAdmin, applyBusinessContext, staffController.getStaffById.bind(staffController));
router.post('/', requireBusinessOrAdmin, applyBusinessContext, uploadSingleProfileImage, staffController.createStaff.bind(staffController));
router.put('/:id', requireBusinessOrAdmin, applyBusinessContext, uploadSingleProfileImage, staffController.updateStaff.bind(staffController));
router.delete('/:id', requireBusinessOrAdmin, applyBusinessContext, staffController.deleteStaff.bind(staffController));

export default router; 