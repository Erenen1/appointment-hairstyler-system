"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/admin/login', authController_1.adminLogin);
router.post('/logout', authMiddleware_1.requireAdmin, authController_1.logout);
router.get('/profile', authMiddleware_1.requireAdmin, authController_1.getCurrentUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map