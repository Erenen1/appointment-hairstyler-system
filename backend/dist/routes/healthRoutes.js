"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_1 = require("../controllers/healthController");
const router = (0, express_1.Router)();
router.get('/', healthController_1.HealthController.getSystemHealth);
router.get('/database', healthController_1.HealthController.getDatabaseHealth);
router.get('/server', healthController_1.HealthController.getServerInfo);
router.get('/liveness', healthController_1.HealthController.liveness);
router.get('/readiness', healthController_1.HealthController.readiness);
exports.default = router;
//# sourceMappingURL=healthRoutes.js.map