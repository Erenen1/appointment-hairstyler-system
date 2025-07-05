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
        var _a, _b, _c, _d;
        const duration = Date.now() - startTime;
        logger_1.loggerHelpers.apiResponse(req.method, req.originalUrl, res.statusCode, duration, {
            requestId: req.id,
            userId: (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id,
            userType: (_d = (_c = req.session) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.userType
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