import { Router } from "express";
import StaffController from "./staff.controller";
import StaffService from "./staff.service";
import StaffRepository from "./staff.repository";
import { requireAdmin } from "../../middleware/authMiddleware";
import { uploadSingleProfileImage } from "../../config/multer";

/**
 * Personel modülü için route tanımlamaları
 */

// Dependency Injection
const staffRepository = new StaffRepository();
const staffService = new StaffService(staffRepository);
const staffController = new StaffController(staffService);

const router = Router();

// Routes
router.get('/', staffController.getAllStaff.bind(staffController));
router.get('/:id', staffController.getStaffById.bind(staffController));
router.post('/', requireAdmin, uploadSingleProfileImage, staffController.createStaff.bind(staffController));
router.put('/:id', requireAdmin, uploadSingleProfileImage, staffController.updateStaff.bind(staffController));
router.delete('/:id', requireAdmin, staffController.deleteStaff.bind(staffController));

export default router; 