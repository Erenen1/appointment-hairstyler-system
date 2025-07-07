"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const availabilityController_1 = require("../controllers/availabilityController");
const router = (0, express_1.Router)();
router.get('/all', availabilityController_1.getAllStaffAvailability);
router.get('/', availabilityController_1.getStaffAvailability);
router.post('/', authMiddleware_1.requireAdmin, availabilityController_1.createAvailability);
router.post('/bulk', authMiddleware_1.requireAdmin, availabilityController_1.bulkCreateAvailability);
router.put('/:id', authMiddleware_1.requireAdmin, availabilityController_1.updateAvailability);
router.delete('/:id', authMiddleware_1.requireAdmin, availabilityController_1.deleteAvailability);
exports.default = router;
//# sourceMappingURL=availabilityRoutes.js.map