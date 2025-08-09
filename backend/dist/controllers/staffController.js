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
exports.getAvailableSlotsRange = exports.getAvailableSlots = exports.updateStaff = exports.createStaff = exports.getStaffById = exports.getStaff = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const path_1 = __importDefault(require("path"));
const multer_1 = require("../config/multer");
const index_1 = __importDefault(require("../models/index"));
const { Staff, StaffService, Service, ServiceCategory } = index_1.default;
const getStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, isActive } = req.query;
        const whereConditions = {};
        if (isActive === 'true' || isActive === 'false') {
            whereConditions.isActive = isActive === 'true';
        }
        const offset = (Number(page) - 1) * Number(limit);
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
            limit: Number(limit),
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
        const totalPages = Math.ceil(count / Number(limit));
        const paginationInfo = {
            currentPage: Number(page),
            totalPages,
            totalItems: count,
            itemsPerPage: Number(limit),
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1
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
        const { id } = req.params;
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
        const { fullName, email, phone, specialties, serviceIds } = req.body;
        if (!fullName || !email || !phone) {
            throw utils_1.ApiError.badRequest('Ad-soyad, e-posta ve telefon alanları zorunludur');
        }
        const existingStaff = yield Staff.findOne({
            where: { email: { [sequelize_1.Op.iLike]: email } }
        });
        if (existingStaff) {
            throw utils_1.ApiError.conflict('Bu email adresi ile kayıtlı personel zaten mevcut');
        }
        let avatarPath = null;
        if (req.file) {
            const fileName = req.file.filename;
            avatarPath = (0, multer_1.generateFileUrl)(req, path_1.default.join('profiles', fileName));
        }
        const staff = yield Staff.create({
            fullName,
            email,
            phone,
            specialties,
            avatar: avatarPath,
            isActive: true
        });
        const serviceIdsString = req.body.serviceIds;
        if (serviceIdsString) {
            const serviceIdsArray = yield JSON.parse(serviceIdsString);
            if (serviceIdsArray && serviceIdsArray.length > 0) {
                yield Promise.all(serviceIdsArray.map(serviceId => StaffService.create({
                    staffId: staff.id,
                    serviceId: serviceId,
                    isActive: true
                })));
            }
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
        const { id } = req.params;
        const { fullName, email, phone, specialties, isActive, serviceIds } = req.body;
        const staff = yield Staff.findByPk(id);
        if (!staff) {
            throw utils_1.ApiError.notFound('Personel bulunamadı');
        }
        if (email && email !== staff.email) {
            const existingStaff = yield Staff.findOne({
                where: {
                    email: { [sequelize_1.Op.iLike]: email },
                    id: { [sequelize_1.Op.ne]: id }
                }
            });
            if (existingStaff) {
                throw utils_1.ApiError.conflict('Bu email adresi başka bir personel tarafından kullanılıyor');
            }
        }
        let avatarPath = staff.avatar;
        if (req.file) {
            if (staff.avatar) {
                const oldAvatarPath = path_1.default.join(__dirname, '../../uploads', staff.avatar);
                yield (0, multer_1.deleteFile)(oldAvatarPath);
            }
            const fileName = req.file.filename;
            avatarPath = path_1.default.join('profiles', fileName);
        }
        yield staff.update({
            fullName: fullName || staff.fullName,
            email: email || staff.email,
            phone: phone || staff.phone,
            specialties: specialties !== undefined ? specialties : staff.specialties,
            avatar: avatarPath,
            isActive: isActive !== undefined ? isActive : staff.isActive
        });
        if (serviceIds) {
            const serviceIdsArray = JSON.parse(serviceIds);
            const existingServices = yield StaffService.findAll({
                where: { staffId: id }
            });
            yield Promise.all(existingServices.map(service => service.update({ isActive: false })));
            yield Promise.all(serviceIdsArray.map((serviceId) => __awaiter(void 0, void 0, void 0, function* () {
                const existingService = yield StaffService.findOne({
                    where: { staffId: id, serviceId }
                });
                if (existingService) {
                    yield existingService.update({ isActive: true });
                }
                else {
                    yield StaffService.create({
                        staffId: id,
                        serviceId,
                        isActive: true
                    });
                }
            })));
        }
        const updatedStaff = yield Staff.findByPk(id, {
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
        res.json(utils_1.ApiSuccess.updated(updatedStaff, 'Personel başarıyla güncellendi'));
    }
    catch (error) {
        next(error);
    }
});
exports.updateStaff = updateStaff;
const getAvailableSlots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { date, serviceId } = req.query;
        if (!date) {
            throw utils_1.ApiError.badRequest('Tarih parametresi gereklidir');
        }
        const staff = yield Staff.findByPk(id);
        if (!staff || !staff.isActive) {
            throw utils_1.ApiError.notFound('Personel bulunamadı veya aktif değil');
        }
        if (serviceId) {
            const staffService = yield StaffService.findOne({
                where: {
                    staffId: id,
                    serviceId,
                    isActive: true
                }
            });
            if (!staffService) {
                throw utils_1.ApiError.badRequest('Personel bu hizmeti veremiyor');
            }
        }
        const dateStr = typeof date === 'string' ? date : String(date);
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
const getAvailableSlotsRange = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { startDate, endDate, serviceId } = req.query;
        if (!startDate || !endDate) {
            throw utils_1.ApiError.badRequest('Başlangıç ve bitiş tarihi parametreleri gereklidir');
        }
        const staff = yield Staff.findByPk(id);
        if (!staff || !staff.isActive) {
            throw utils_1.ApiError.notFound('Personel bulunamadı veya aktif değil');
        }
        if (serviceId) {
            const staffService = yield StaffService.findOne({
                where: {
                    staffId: id,
                    serviceId,
                    isActive: true
                }
            });
            if (!staffService) {
                throw utils_1.ApiError.badRequest('Personel bu hizmeti veremiyor');
            }
        }
        const startDateStr = typeof startDate === 'string' ? startDate : String(startDate);
        const endDateStr = typeof endDate === 'string' ? endDate : String(endDate);
        const { eachDayOfInterval } = require('date-fns');
        const dates = eachDayOfInterval({
            start: new Date(startDateStr),
            end: new Date(endDateStr)
        });
        const businessHours = yield index_1.default.BusinessHours.findAll({
            order: [['dayOfWeek', 'ASC']]
        });
        const staffAvailabilities = yield index_1.default.StaffAvailability.findAll({
            where: {
                staffId: id,
                date: {
                    [sequelize_1.Op.between]: [(0, date_fns_1.format)(new Date(startDateStr), 'yyyy-MM-dd'), (0, date_fns_1.format)(new Date(endDateStr), 'yyyy-MM-dd')]
                }
            }
        });
        const appointments = yield index_1.default.Appointment.findAll({
            where: {
                staffId: id,
                appointmentDate: {
                    [sequelize_1.Op.between]: [(0, date_fns_1.format)(new Date(startDateStr), 'yyyy-MM-dd'), (0, date_fns_1.format)(new Date(endDateStr), 'yyyy-MM-dd')]
                }
            },
            attributes: ['appointmentDate', 'startTime', 'endTime']
        });
        const dailyAvailability = yield Promise.all(dates.map((date) => __awaiter(void 0, void 0, void 0, function* () {
            const dateStr = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
            const dayOfWeek = date.getDay() || 7;
            const staffAvailability = staffAvailabilities.find(sa => sa.date === dateStr);
            const businessHour = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
            const dayAppointments = appointments.filter(apt => apt.appointmentDate === dateStr);
            let workingHours;
            let isAvailable = true;
            let reason = null;
            if (staffAvailability) {
                if (!staffAvailability.isAvailable) {
                    isAvailable = false;
                    reason = staffAvailability.notes || 'Personel bu tarihte müsait değil';
                }
                else {
                    workingHours = {
                        start: staffAvailability.startTime,
                        end: staffAvailability.endTime,
                        lunchBreak: staffAvailability.lunchBreakStart && staffAvailability.lunchBreakEnd ? {
                            start: staffAvailability.lunchBreakStart,
                            end: staffAvailability.lunchBreakEnd
                        } : null
                    };
                }
            }
            else if (businessHour && !businessHour.isClosed) {
                workingHours = {
                    start: businessHour.openTime,
                    end: businessHour.closeTime,
                    lunchBreak: {
                        start: '12:00:00',
                        end: '13:00:00'
                    }
                };
            }
            else {
                isAvailable = false;
                reason = 'Salon bu gün kapalı';
            }
            let availableSlots = [];
            if (isAvailable && workingHours) {
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
                availableSlots = allSlots.filter(slot => {
                    if (workingHours.lunchBreak) {
                        const lunchStart = workingHours.lunchBreak.start.substring(0, 5);
                        const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
                        if (slot >= lunchStart && slot < lunchEnd) {
                            return false;
                        }
                    }
                    return !dayAppointments.some(appointment => {
                        const appointmentStart = appointment.startTime.substring(0, 5);
                        const appointmentEnd = appointment.endTime.substring(0, 5);
                        return slot >= appointmentStart && slot < appointmentEnd;
                    });
                }).map(slot => ({
                    time: slot,
                    displayTime: slot,
                    available: true
                }));
            }
            return {
                date: dateStr,
                dayOfWeek,
                isAvailable,
                reason,
                availableSlots,
                totalSlots: availableSlots.length,
                workingHours: workingHours ? {
                    start: workingHours.start.substring(0, 5),
                    end: workingHours.end.substring(0, 5),
                    lunchBreak: workingHours.lunchBreak ?
                        `${workingHours.lunchBreak.start.substring(0, 5)} - ${workingHours.lunchBreak.end.substring(0, 5)}` :
                        null
                } : null,
                existingAppointments: dayAppointments.map(apt => ({
                    startTime: apt.startTime.substring(0, 5),
                    endTime: apt.endTime.substring(0, 5)
                }))
            };
        })));
        const response = {
            staffId: id,
            staffName: staff.fullName,
            startDate: (0, date_fns_1.format)(new Date(startDateStr), 'yyyy-MM-dd'),
            endDate: (0, date_fns_1.format)(new Date(endDateStr), 'yyyy-MM-dd'),
            totalDays: dailyAvailability.length,
            availableDays: dailyAvailability.filter(day => day.isAvailable && day.totalSlots > 0).length,
            dailyAvailability
        };
        res.json(utils_1.ApiSuccess.item(response, 'Personelin tarih aralığındaki müsait saatleri başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getAvailableSlotsRange = getAvailableSlotsRange;
//# sourceMappingURL=staffController.js.map