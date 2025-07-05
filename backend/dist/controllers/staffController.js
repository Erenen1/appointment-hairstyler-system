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
exports.getAvailableSlots = exports.updateStaff = exports.createStaff = exports.getStaffById = exports.getStaff = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const staffValidation_1 = require("../validations/staffValidation");
const index_1 = __importDefault(require("../models/index"));
const { Staff, Service } = index_1.default;
const getStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = staffValidation_1.staffListQuerySchema.validate(req.query);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { page, limit, isActive } = value;
        const whereConditions = {};
        if (typeof isActive === 'boolean') {
            whereConditions.isActive = isActive;
        }
        const offset = (page - 1) * limit;
        const { count, rows } = yield Staff.findAndCountAll({
            limit,
            offset,
            distinct: true
        });
        const totalPages = Math.ceil(count / limit);
        const paginationInfo = {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
        res.json(utils_1.ApiSuccess.list(rows, paginationInfo, 'Personeller başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getStaff = getStaff;
const getStaffById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = staffValidation_1.staffIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { id } = value;
        const staff = yield Staff.findByPk(id);
        if (!staff) {
            throw utils_1.ApiError.notFound('Personel bulunamadı');
        }
        res.json(utils_1.ApiSuccess.item(staff, 'Personel detayları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getStaffById = getStaffById;
const createStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = staffValidation_1.createStaffSchema.validate(req.body);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { fullName, email, phone, specialties, avatar } = value;
        const existingStaff = yield Staff.findOne({
            where: { email: { [sequelize_1.Op.iLike]: email } }
        });
        if (existingStaff) {
            throw utils_1.ApiError.conflict('Bu email adresi ile kayıtlı personel zaten mevcut');
        }
        const staff = yield Staff.create({
            fullName,
            email,
            phone,
            specialties,
            avatar,
            isActive: true
        });
        const createdStaff = yield staff.toJSON();
        res.status(201).json(utils_1.ApiSuccess.created(createdStaff, 'Personel başarıyla oluşturuldu'));
    }
    catch (error) {
        next(error);
    }
});
exports.createStaff = createStaff;
const updateStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error: paramsError, value: paramsValue } = staffValidation_1.staffIdSchema.validate(req.params);
        if (paramsError) {
            throw utils_1.ApiError.fromJoi(paramsError);
        }
        const { error: bodyError, value: bodyValue } = staffValidation_1.updateStaffSchema.validate(req.body);
        if (bodyError) {
            throw utils_1.ApiError.fromJoi(bodyError);
        }
        const { id } = paramsValue;
        const updateData = bodyValue;
        const staff = yield Staff.findByPk(id);
        if (!staff) {
            throw utils_1.ApiError.notFound('Personel bulunamadı');
        }
        if (updateData.email && updateData.email !== staff.email) {
            const existingStaff = yield Staff.findOne({
                where: {
                    email: { [sequelize_1.Op.iLike]: updateData.email },
                    id: { [sequelize_1.Op.ne]: id }
                }
            });
            if (existingStaff) {
                throw utils_1.ApiError.conflict('Bu email adresi ile kayıtlı başka personel mevcut');
            }
        }
        const { serviceIds } = updateData, staffUpdateData = __rest(updateData, ["serviceIds"]);
        const updatedStaff = yield staff.update(staffUpdateData);
        res.json(utils_1.ApiSuccess.updated(updatedStaff, 'Personel başarıyla güncellendi'));
    }
    catch (error) {
        next(error);
    }
});
exports.updateStaff = updateStaff;
const getAvailableSlots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error: paramsError, value: paramsValue } = staffValidation_1.staffIdSchema.validate(req.params);
        if (paramsError) {
            throw utils_1.ApiError.fromJoi(paramsError);
        }
        const { error: queryError, value: queryValue } = staffValidation_1.availableSlotsQuerySchema.validate(req.query);
        if (queryError) {
            throw utils_1.ApiError.fromJoi(queryError);
        }
        const { id } = paramsValue;
        const { date } = queryValue;
        const staff = yield Staff.findByPk(id, {
            where: { isActive: true }
        });
        if (!staff) {
            throw utils_1.ApiError.notFound('Personel bulunamadı veya aktif değil');
        }
        const slots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30'
        ];
        res.json(utils_1.ApiSuccess.item(slots, 'Müsait saatler başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getAvailableSlots = getAvailableSlots;
//# sourceMappingURL=staffController.js.map