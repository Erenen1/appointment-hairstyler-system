"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const contentController_1 = require("../controllers/contentController");
const router = (0, express_1.Router)();
router.get('/gallery', contentController_1.getGalleryImages);
router.post('/gallery', authMiddleware_1.requireAdmin, contentController_1.createGalleryImage);
exports.default = router;
//# sourceMappingURL=contentRoutes.js.map