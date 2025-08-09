"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerHelpers = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("./env"));
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json(), winston_1.default.format.prettyPrint());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.printf((_a) => {
    var { timestamp, level, message } = _a, meta = __rest(_a, ["timestamp", "level", "message"]);
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
        metaStr = '\n' + JSON.stringify(meta, null, 2);
    }
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
}));
const logDir = path_1.default.join(process.cwd(), 'logs');
const logger = winston_1.default.createLogger({
    level: env_1.default.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: {
        service: 'kuafor-backend',
        environment: env_1.default.NODE_ENV || 'development'
    },
    transports: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json())
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json())
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, 'access.log'),
            level: 'http',
            maxsize: 5242880,
            maxFiles: 10,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json())
        })
    ],
    exitOnError: false,
    silent: env_1.default.NODE_ENV === 'test'
});
if (env_1.default.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: consoleFormat,
        level: 'debug'
    }));
}
if (env_1.default.NODE_ENV === 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.simple()),
        level: 'warn'
    }));
}
exports.default = logger;
exports.loggerHelpers = {
    database: (operation, table, duration, meta) => {
        logger.info('Database Operation', Object.assign({ type: 'database', operation,
            table, duration: duration ? `${duration}ms` : undefined }, meta));
    },
    apiResponse: (method, url, statusCode, duration, meta) => {
        const logLevel = statusCode >= 400 ? 'warn' : 'info';
        logger.log(logLevel, 'API Response', Object.assign({ type: 'api_response', method,
            url,
            statusCode, duration: `${duration}ms` }, meta));
    },
    auth: (action, userId, ip, meta) => {
        logger.info('Authentication', Object.assign({ type: 'authentication', action,
            userId,
            ip }, meta));
    },
    business: (action, meta) => {
        logger.info('Business Logic', Object.assign({ type: 'business', action }, meta));
    },
    system: (event, meta) => {
        logger.info('System Event', Object.assign({ type: 'system', event }, meta));
    }
};
//# sourceMappingURL=logger.js.map