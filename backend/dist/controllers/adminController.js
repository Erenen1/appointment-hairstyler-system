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
exports.createAdminWithApiKey = void 0;
const utils_1 = require("../utils");
const adminValidation_1 = require("../validations/adminValidation");
const index_1 = __importDefault(require("../models/index"));
const { Admin } = index_1.default;
const createAdminWithApiKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = adminValidation_1.createAdminSchema.validate(req.body);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { password, fullName, email, phone, isActive = true } = value;
        const existingUsername = yield Admin.findOne({ where: { email } });
        if (existingUsername) {
            throw utils_1.ApiError.conflict('Bu e-posta adresi zaten kullanılıyor');
        }
        const existingEmail = yield Admin.findOne({ where: { email } });
        if (existingEmail) {
            throw utils_1.ApiError.conflict('Bu e-posta adresi zaten kullanılıyor');
        }
        const hashedPassword = utils_1.HashUtils.hashPassword(password);
        const admin = yield Admin.create({
            password: hashedPassword,
            fullName,
            email,
            phone,
            isActive
        });
        const adminData = admin.toJSON();
        delete adminData.password;
        res.status(201).json(utils_1.ApiSuccess.created(adminData, 'Super Admin tarafından admin başarıyla oluşturuldu'));
    }
    catch (error) {
        next(error);
    }
});
exports.createAdminWithApiKey = createAdminWithApiKey;
//# sourceMappingURL=adminController.js.map