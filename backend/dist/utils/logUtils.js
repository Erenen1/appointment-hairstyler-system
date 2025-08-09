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
exports.PerformanceTracker = exports.LogManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../config/logger"));
class LogManager {
    static cleanOldLogs() {
        return __awaiter(this, arguments, void 0, function* (daysToKeep = 30) {
            try {
                const logDir = path_1.default.join(process.cwd(), 'logs');
                const files = yield fs_1.default.promises.readdir(logDir);
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
                for (const file of files) {
                    const filePath = path_1.default.join(logDir, file);
                    const stats = yield fs_1.default.promises.stat(filePath);
                    if (stats.mtime < cutoffDate) {
                        yield fs_1.default.promises.unlink(filePath);
                        logger_1.default.info('Old log file deleted', { file, deletedAt: new Date() });
                    }
                }
            }
            catch (error) {
                logger_1.default.error('Error cleaning old logs', { error });
            }
        });
    }
    static getLogDirectorySize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logDir = path_1.default.join(process.cwd(), 'logs');
                const files = yield fs_1.default.promises.readdir(logDir);
                let totalSize = 0;
                for (const file of files) {
                    const filePath = path_1.default.join(logDir, file);
                    const stats = yield fs_1.default.promises.stat(filePath);
                    totalSize += stats.size;
                }
                return totalSize;
            }
            catch (error) {
                logger_1.default.error('Error calculating log directory size', { error });
                return 0;
            }
        });
    }
    static ensureLogDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logDir = path_1.default.join(process.cwd(), 'logs');
                yield fs_1.default.promises.mkdir(logDir, { recursive: true });
            }
            catch (error) {
                console.error('Error creating log directory:', error);
            }
        });
    }
}
exports.LogManager = LogManager;
class PerformanceTracker {
    constructor(label) {
        this.label = label;
        this.startTime = Date.now();
    }
    end(meta) {
        const duration = Date.now() - this.startTime;
        logger_1.default.info('Performance Measurement', Object.assign({ type: 'performance', label: this.label, duration: `${duration}ms` }, meta));
        return duration;
    }
    static track(label, operation) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const tracker = new PerformanceTracker(label);
            try {
                const result = yield operation();
                tracker.end({ success: true });
                resolve(result);
            }
            catch (error) {
                tracker.end({ success: false, error: error instanceof Error ? error.message : String(error) });
                reject(error);
            }
        }));
    }
}
exports.PerformanceTracker = PerformanceTracker;
//# sourceMappingURL=logUtils.js.map