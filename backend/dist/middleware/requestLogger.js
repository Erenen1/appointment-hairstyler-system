"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestContext = exports.requestLogger = void 0;
const logger_1 = require("../config/logger");
const generateRequestId = () => {
    return Math.random().toString(36).substring(2, 9);
};
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const oldSend = res.send;
    res.send = function (body) {
        var _a, _b;
        const duration = Date.now() - startTime;
        logger_1.loggerHelpers.apiResponse(req.method, req.originalUrl, res.statusCode, duration, {
            requestId: req.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            userType: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userType
        });
        return oldSend.apply(res, arguments);
    };
    next();
};
exports.requestLogger = requestLogger;
const getRequestContext = (req) => ({
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.socket.remoteAddress,
});
exports.getRequestContext = getRequestContext;
//# sourceMappingURL=requestLogger.js.map