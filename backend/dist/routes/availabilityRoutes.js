"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const availabilityController_1 = require("../controllers/availabilityController");
const router = (0, express_1.Router)();
router.get('/staff/:staffId/date/:date', availabilityController_1.getStaffAvailableSlots);
router.get('/range', availabilityController_1.getAvailabilityByDateRange);
router.get('/staff-available/:date', availabilityController_1.getAvailableStaffByDate);
router.post('/auto-create', availabilityController_1.createAutoAvailability);
router.put('/staff/:staffId/date/:date', availabilityController_1.updateStaffAvailability);
exports.default = router;
//# sourceMappingURL=availabilityRoutes.js.map