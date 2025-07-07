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
const { Staff, StaffService, Service, ServiceCategory } = index_1.default;
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
            where: whereConditions,
            include: [
                {
                    model: Service,
                    as: 'services',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'title', 'price', 'duration'],
                    include: [
                        {
                            model: ServiceCategory,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ],
            limit,
            offset,
            distinct: true
        });
        const formattedStaff = rows.map(staff => {
            var _a, _b;
            return ({
                id: staff.id,
                fullName: staff.fullName,
                email: staff.email,
                phone: staff.phone,
                specialties: staff.specialties,
                avatar: staff.avatar,
                isActive: staff.isActive,
                services: ((_b = (_a = staff.services) === null || _a === void 0 ? void 0 : _a.filter(service => { var _a; return (_a = service.StaffService) === null || _a === void 0 ? void 0 : _a.isActive; })) === null || _b === void 0 ? void 0 : _b.map(service => ({
                    id: service.id,
                    title: service.title,
                    price: service.price,
                    duration: service.duration,
                    category: service.category
                }))) || [],
                createdAt: staff.createdAt,
                updatedAt: staff.updatedAt
            });
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
        res.json(utils_1.ApiSuccess.list(formattedStaff, paginationInfo, 'Personeller başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getStaff = getStaff;
const getStaffById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { error, value } = staffValidation_1.staffIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { id } = value;
        const staff = yield Staff.findByPk(id, {
            include: [
                {
                    model: Service,
                    as: 'services',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'title', 'description', 'price', 'duration'],
                    include: [
                        {
                            model: ServiceCategory,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });
        if (!staff) {
            throw utils_1.ApiError.notFound('Personel bulunamadı');
        }
        const formattedStaff = Object.assign(Object.assign({}, staff.toJSON()), { services: ((_b = (_a = staff.services) === null || _a === void 0 ? void 0 : _a.filter(service => { var _a; return (_a = service.StaffService) === null || _a === void 0 ? void 0 : _a.isActive; })) === null || _b === void 0 ? void 0 : _b.map(service => ({
                id: service.id,
                title: service.title,
                description: service.description,
                price: service.price,
                duration: service.duration,
                category: service.category
            }))) || [] });
        res.json(utils_1.ApiSuccess.item(formattedStaff, 'Personel detayları başarıyla getirildi'));
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
        const { fullName, email, phone, specialties, avatar, serviceIds } = value;
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
        if (serviceIds && serviceIds.length > 0) {
            yield Promise.all(serviceIds.map(serviceId => StaffService.create({
                staffId: staff.id,
                serviceId: serviceId,
                isActive: true
            })));
        }
        const staffWithServices = yield Staff.findByPk(staff.id, {
            include: [
                {
                    model: Service,
                    as: 'services',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'title', 'price', 'duration'],
                    include: [
                        {
                            model: ServiceCategory,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });
        res.status(201).json(utils_1.ApiSuccess.created(staffWithServices, 'Personel başarıyla oluşturuldu'));
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
        if (serviceIds && Array.isArray(serviceIds)) {
            yield StaffService.destroy({
                where: { staffId: id }
            });
            if (serviceIds.length > 0) {
                yield Promise.all(serviceIds.map(serviceId => StaffService.create({
                    staffId: id,
                    serviceId: serviceId,
                    isActive: true
                })));
            }
        }
        const updatedStaffWithServices = yield Staff.findByPk(id, {
            include: [
                {
                    model: Service,
                    as: 'services',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'title', 'price', 'duration'],
                    include: [
                        {
                            model: ServiceCategory,
                            as: 'category',
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });
        res.json(utils_1.ApiSuccess.updated(updatedStaffWithServices, 'Personel başarıyla güncellendi'));
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
        const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
        const targetDate = new Date(dateStr);
        const dayOfWeek = targetDate.getDay() || 7;
        const staffAvailability = yield index_1.default.StaffAvailability.findOne({
            where: {
                staffId: id,
                date: dateStr
            }
        });
        let workingHours;
        if (staffAvailability) {
            if (!staffAvailability.isAvailable) {
                res.json(utils_1.ApiSuccess.item({
                    date: dateStr,
                    staffId: id,
                    staffName: staff.fullName,
                    isAvailable: false,
                    reason: staffAvailability.notes || 'Personel bu tarihte müsait değil',
                    availableSlots: [],
                    totalSlots: 0
                }, 'Personel bu tarihte müsait değil'));
                return;
            }
            workingHours = {
                start: staffAvailability.startTime,
                end: staffAvailability.endTime,
                lunchBreak: staffAvailability.lunchBreakStart && staffAvailability.lunchBreakEnd ? {
                    start: staffAvailability.lunchBreakStart,
                    end: staffAvailability.lunchBreakEnd
                } : null
            };
        }
        else {
            const businessHour = yield index_1.default.BusinessHours.findOne({
                where: { dayOfWeek }
            });
            if (!businessHour || businessHour.isClosed) {
                res.json(utils_1.ApiSuccess.item({
                    date: dateStr,
                    staffId: id,
                    staffName: staff.fullName,
                    isAvailable: false,
                    reason: 'Salon bu gün kapalı',
                    availableSlots: [],
                    totalSlots: 0
                }, 'Salon bu gün kapalı'));
                return;
            }
            workingHours = {
                start: businessHour.openTime,
                end: businessHour.closeTime,
                lunchBreak: {
                    start: '12:00:00',
                    end: '13:00:00'
                }
            };
        }
        const existingAppointments = yield index_1.default.Appointment.findAll({
            where: {
                staffId: id,
                appointmentDate: dateStr
            },
            attributes: ['startTime', 'endTime'],
            order: [['startTime', 'ASC']]
        });
        const startHour = parseInt(workingHours.start.split(':')[0]);
        const startMinute = parseInt(workingHours.start.split(':')[1]);
        const endHour = parseInt(workingHours.end.split(':')[0]);
        const endMinute = parseInt(workingHours.end.split(':')[1]);
        const allSlots = [];
        let currentHour = startHour;
        let currentMinute = startMinute;
        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            allSlots.push(timeStr);
            currentMinute += 30;
            if (currentMinute >= 60) {
                currentMinute = 0;
                currentHour += 1;
            }
        }
        const availableSlots = allSlots.filter(slot => {
            if (workingHours.lunchBreak) {
                const lunchStart = workingHours.lunchBreak.start.substring(0, 5);
                const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
                if (slot >= lunchStart && slot < lunchEnd) {
                    return false;
                }
            }
            return !existingAppointments.some(appointment => {
                const appointmentStart = appointment.startTime.substring(0, 5);
                const appointmentEnd = appointment.endTime.substring(0, 5);
                return slot >= appointmentStart && slot < appointmentEnd;
            });
        });
        const formattedSlots = availableSlots.map(slot => ({
            time: slot,
            displayTime: slot,
            available: true
        }));
        const response = {
            date: dateStr,
            staffId: id,
            staffName: staff.fullName,
            isAvailable: true,
            availableSlots: formattedSlots,
            totalSlots: formattedSlots.length,
            workingHours: {
                start: workingHours.start.substring(0, 5),
                end: workingHours.end.substring(0, 5),
                lunchBreak: workingHours.lunchBreak ?
                    `${workingHours.lunchBreak.start.substring(0, 5)} - ${workingHours.lunchBreak.end.substring(0, 5)}` :
                    null
            },
            existingAppointments: existingAppointments.map(apt => ({
                startTime: apt.startTime.substring(0, 5),
                endTime: apt.endTime.substring(0, 5)
            }))
        };
        res.json(utils_1.ApiSuccess.item(response, 'Müsait saatler başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getAvailableSlots = getAvailableSlots;
//# sourceMappingURL=staffController.js.map