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
exports.getCurrentUser = exports.logout = exports.adminLogin = void 0;
const utils_1 = require("../utils");
const authValidation_1 = require("../validations/authValidation");
const logger_1 = __importDefault(require("../config/logger"));
const index_1 = __importDefault(require("../models/index"));
const { Admin } = index_1.default;
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = authValidation_1.loginSchema.validate(req.body);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { email, password } = value;
        const admin = yield Admin.findOne({
            where: {
                email,
                isActive: true
            }
        });
        if (!admin) {
            throw utils_1.ApiError.authentication('Email veya şifre hatalı');
        }
        const isPasswordValid = utils_1.HashUtils.verifyPassword(password, admin.password);
        if (!isPasswordValid) {
            throw utils_1.ApiError.authentication('Email veya şifre hatalı');
        }
        yield admin.update({ lastLogin: new Date() });
        req.session.user = {
            id: admin.id,
            email: admin.email,
            userType: 'admin',
            fullName: admin.fullName
        };
        req.session.save((err) => {
            if (err) {
                logger_1.default.error('Session save error:', err);
            }
        });
        res.json(utils_1.ApiSuccess.item({
            user: {
                id: admin.id,
                email: admin.email,
                fullName: admin.fullName,
                userType: 'admin',
                phone: admin.phone,
                isActive: admin.isActive,
                lastLogin: admin.lastLogin
            }
        }, 'Giriş başarılı'));
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogin = adminLogin;
const logout = (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                throw utils_1.ApiError.internal('Çıkış işlemi sırasında hata oluştu');
            }
            res.clearCookie('sessionid');
            res.json(utils_1.ApiSuccess.message('Çıkış başarılı'));
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const getCurrentUser = (req, res, next) => {
    try {
        res.json(utils_1.ApiSuccess.item({
            user: req.session.user
        }, 'Kullanıcı bilgileri getirildi'));
    }
    catch (error) {
        next(error);
    }
};
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=authController.js.map