"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.requireAdmin, customerController_1.getCustomers);
router.get('/:id', authMiddleware_1.requireAdmin, customerController_1.getCustomerById);
router.post('/', authMiddleware_1.requireAdmin, customerController_1.createCustomer);
router.put('/:id', authMiddleware_1.requireAdmin, customerController_1.updateCustomer);
router.delete('/:id', authMiddleware_1.requireAdmin, customerController_1.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customerRoutes.js.map