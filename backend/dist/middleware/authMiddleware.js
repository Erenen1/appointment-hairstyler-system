"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrSuperApiKey = exports.requireSuperAdminApiKey = exports.requireAdmin = void 0;
const ApiError_1 = require("../utils/ApiError");
const env_1 = require("../config/env");
const requireAdmin = (req, res, next) => {
    if (!req.session.user) {
        throw ApiError_1.ApiError.authentication('Oturum açmanız gerekiyor');
    }
    if (req.session.user.userType !== 'admin') {
        throw ApiError_1.ApiError.authorization('Bu işlem için admin yetkisi gerekiyor');
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireSuperAdminApiKey = (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            throw ApiError_1.ApiError.authentication('X-API-KEY header\'ı eksik');
        }
        if (apiKey !== env_1.config.SUPER_ADMIN_API_KEY) {
            throw ApiError_1.ApiError.authentication('Geçersiz API key');
        }
        req.superAdmin = true;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireSuperAdminApiKey = requireSuperAdminApiKey;
const requireAdminOrSuperApiKey = (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (apiKey) {
            if (apiKey === env_1.config.SUPER_ADMIN_API_KEY) {
                req.superAdmin = true;
                return next();
            }
            else {
                throw ApiError_1.ApiError.authentication('Geçersiz API key');
            }
        }
        if (!req.session.user) {
            throw ApiError_1.ApiError.authentication('Oturum açmanız gerekiyor veya geçerli bir API key sağlamanız gerekiyor');
        }
        if (req.session.user.userType !== 'admin') {
            throw ApiError_1.ApiError.authorization('Bu işlem için admin yetkisi veya super admin API key\'i gerekiyor');
        }
        req.user = req.session.user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireAdminOrSuperApiKey = requireAdminOrSuperApiKey;
//# sourceMappingURL=authMiddleware.js.map