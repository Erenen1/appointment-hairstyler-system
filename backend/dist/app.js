"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("./config/env"));
const cors_2 = require("./config/cors");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
const logger_1 = __importStar(require("./config/logger"));
const logUtils_1 = require("./utils/logUtils");
const database_1 = require("./config/database");
const routes_1 = require("./routes");
const modules_1 = __importDefault(require("./modules"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
app.use((0, cors_1.default)(cors_2.corsConfig));
logUtils_1.LogManager.ensureLogDirectory();
app.use(requestLogger_1.requestLogger);
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/', modules_1.default);
(0, routes_1.setupSwagger)(app);
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.initializeAndSyncDatabase)();
    }
    catch (error) {
        logger_1.default.error('Database initialization failed - shutting down', {
            error: error instanceof Error ? error.message : String(error)
        });
        process.exit(1);
    }
});
console.log(env_1.default.NODE_ENV);
logger_1.loggerHelpers.system('Application Started', {
    port: env_1.default.PORT,
    environment: env_1.default.NODE_ENV,
    nodeVersion: process.version,
    database: {
        name: env_1.default.DB_NAME,
        host: env_1.default.DB_HOST,
        port: env_1.default.DB_PORT
    }
});
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection', {
        reason,
        promise: promise.toString()
    });
});
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
    });
    process.exit(1);
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield initializeDatabase();
        app.listen(env_1.default.PORT, () => {
            logger_1.default.info(`Server is running on port ${env_1.default.PORT}`);
            logger_1.default.info('Available endpoints:', {
                health: '/health',
                database: '/health/database',
                server: '/health/server',
                liveness: '/health/liveness',
                readiness: '/health/readiness',
                auth: '/api/v1/auth'
            });
            setInterval(() => {
                logUtils_1.LogManager.cleanOldLogs(30);
            }, 24 * 60 * 60 * 1000);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server', { error: error instanceof Error ? error.message : String(error) });
        process.exit(1);
    }
});
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
exports.default = app;
//# sourceMappingURL=app.js.map