"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const env_1 = __importDefault(require("./env"));
exports.corsConfig = {
    origin: [
        env_1.default.DOMAIN,
        env_1.default.FRONTEND_DOMAIN,
        "kaancetin.com",
        'http://localhost:3000',
        'http://localhost:3001',
        "*"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
    optionsSuccessStatus: 200
};
//# sourceMappingURL=cors.js.map