"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffController_1 = require("../controllers/staffController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', staffController_1.getStaff);
router.get('/:id', staffController_1.getStaffById);
router.post('/', authMiddleware_1.requireAdmin, staffController_1.createStaff);
router.put('/:id', authMiddleware_1.requireAdmin, staffController_1.updateStaff);
router.get('/:id/available-slots', staffController_1.getAvailableSlots);
exports.default = router;
//# sourceMappingURL=staffRoutes.js.map