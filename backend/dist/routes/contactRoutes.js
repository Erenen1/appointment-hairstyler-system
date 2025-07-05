"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const contactController_1 = require("../controllers/contactController");
const router = (0, express_1.Router)();
router.get('/messages', authMiddleware_1.requireAdmin, contactController_1.getContactMessages);
router.get('/messages/:id', authMiddleware_1.requireAdmin, contactController_1.getContactMessageById);
router.delete('/messages/:id', authMiddleware_1.requireAdmin, contactController_1.deleteContactMessage);
router.post('/messages', authMiddleware_1.requireAdmin, contactController_1.createContact);
router.get('/stats', authMiddleware_1.requireAdmin, contactController_1.getContactStats);
exports.default = router;
//# sourceMappingURL=contactRoutes.js.map