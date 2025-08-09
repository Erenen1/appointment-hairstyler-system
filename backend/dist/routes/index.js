"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const express_1 = require("express");
const healthRoutes_1 = __importDefault(require("./healthRoutes"));
const modules_1 = __importDefault(require("../modules"));
const swagger_1 = require("./swagger");
Object.defineProperty(exports, "setupSwagger", { enumerable: true, get: function () { return swagger_1.setupSwagger; } });
const router = (0, express_1.Router)();
router.use('/health', healthRoutes_1.default);
router.use('/api', modules_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map