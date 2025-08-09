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
exports.closeConnection = exports.healthCheck = exports.initializeAndSyncDatabase = exports.testConnection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("./logger"));
const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Bilinmeyen hata';
};
const config = {
    database: env_1.default.DB_NAME,
    username: env_1.default.DB_USER,
    password: env_1.default.DB_PASSWORD,
    host: env_1.default.DB_HOST,
    port: env_1.default.DB_PORT,
    dialect: 'postgres',
    logging: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        timestamps: true,
        underscored: false,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};
exports.sequelize = new sequelize_1.Sequelize(config);
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.authenticate();
        logger_1.default.info('Database connection established successfully', {
            database: config.database,
            host: config.host,
            environment: env_1.default.NODE_ENV
        });
        return true;
    }
    catch (error) {
        logger_1.default.error('Unable to connect to database', {
            error: getErrorMessage(error),
            database: config.database,
            host: config.host
        });
        return false;
    }
});
exports.testConnection = testConnection;
const initializeAndSyncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.testConnection)();
        const forceSync = false;
        logger_1.default.info('Initializing database tables', {
            forceSync,
            environment: env_1.default.NODE_ENV
        });
        yield exports.sequelize.sync({ force: forceSync });
        logger_1.default.info('Database tables initialized successfully');
    }
    catch (error) {
        logger_1.default.error('Database initialization failed', {
            error: getErrorMessage(error)
        });
        throw error;
    }
});
exports.initializeAndSyncDatabase = initializeAndSyncDatabase;
const healthCheck = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startTime = Date.now();
        yield exports.sequelize.authenticate();
        const responseTime = Date.now() - startTime;
        return {
            status: 'healthy',
            responseTime: `${responseTime}ms`,
            database: config.database,
            host: config.host
        };
    }
    catch (error) {
        return {
            status: 'unhealthy',
            error: getErrorMessage(error),
            database: config.database,
            host: config.host
        };
    }
});
exports.healthCheck = healthCheck;
const closeConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelize.close();
        logger_1.default.info('Database connection closed');
    }
    catch (error) {
        logger_1.default.error('Error closing database connection', {
            error: getErrorMessage(error)
        });
        throw error;
    }
});
exports.closeConnection = closeConnection;
exports.default = exports.sequelize;
//# sourceMappingURL=database.js.map