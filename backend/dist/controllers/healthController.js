"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const utils_1 = require("../utils");
const database_1 = require("../config/database");
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../config/logger"));
const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Bilinmeyen hata';
};
class HealthController {
    static getSystemHealth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbHealth = yield (0, database_1.healthCheck)();
                const systemHealth = {
                    status: dbHealth.status === 'healthy' ? 'OK' : 'ERROR',
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                    environment: env_1.default.NODE_ENV,
                    version: process.version,
                    platform: process.platform,
                    memory: {
                        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                        external: Math.round(process.memoryUsage().external / 1024 / 1024)
                    },
                    database: dbHealth
                };
                if (dbHealth.status === 'healthy') {
                    res.status(200).json(utils_1.ApiSuccess.item(systemHealth, 'Sistem sağlıklı çalışıyorr'));
                }
                else {
                    throw utils_1.ApiError.internal('Sistem sağlık kontrolünde sorun tespit edildi');
                }
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                logger_1.default.error('System health check failed', { error: errorMessage });
                next(error);
            }
        });
    }
    static getDatabaseHealth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const health = yield (0, database_1.healthCheck)();
                if (health.status === 'healthy') {
                    res.json(utils_1.ApiSuccess.item(health, 'Database bağlantısı sağlıklı'));
                }
                else {
                    throw utils_1.ApiError.database('Database bağlantısında sorun var');
                }
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                logger_1.default.error('Database health check failed', { error: errorMessage });
                next(error);
            }
        });
    }
    static getServerInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serverInfo = {
                    application: {
                        name: 'Kuaför Backend API',
                        version: '1.0.0',
                        environment: env_1.default.NODE_ENV,
                        port: env_1.default.PORT,
                        startTime: new Date(Date.now() - process.uptime() * 1000).toISOString()
                    },
                    runtime: {
                        node: process.version,
                        platform: process.platform,
                        arch: process.arch,
                        uptime: process.uptime(),
                        pid: process.pid
                    },
                    system: {
                        totalMemory: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                        usedMemory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                        freeMemory: Math.round((process.memoryUsage().heapTotal - process.memoryUsage().heapUsed) / 1024 / 1024),
                        externalMemory: Math.round(process.memoryUsage().external / 1024 / 1024)
                    },
                    database: {
                        name: env_1.default.DB_NAME,
                        host: env_1.default.DB_HOST,
                        port: env_1.default.DB_PORT
                    }
                };
                res.json(utils_1.ApiSuccess.item(serverInfo, 'Server bilgileri getirildi'));
            }
            catch (error) {
                const errorMessage = getErrorMessage(error);
                logger_1.default.error('Server info failed', { error: errorMessage });
                next(error);
            }
        });
    }
    static liveness(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static readiness(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dbHealth = yield (0, database_1.healthCheck)();
                if (dbHealth.status === 'healthy') {
                    res.status(200).json({
                        status: 'ready',
                        timestamp: new Date().toISOString(),
                        checks: {
                            database: 'healthy'
                        }
                    });
                }
                else {
                    throw utils_1.ApiError.internal('Database is not ready');
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.HealthController = HealthController;
//# sourceMappingURL=healthController.js.map