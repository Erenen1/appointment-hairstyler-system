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
exports.deleteAvailability = exports.updateAvailability = exports.bulkCreateAvailability = exports.createAvailability = exports.getStaffAvailability = exports.getAllStaffAvailability = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const eachDayOfInterval_1 = require("date-fns/eachDayOfInterval");
const index_1 = __importDefault(require("../models/index"));
const { StaffAvailability, Staff, BusinessHours, Appointment, Service, StaffService } = index_1.default;
const getAllStaffAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate, serviceId } = req.query;
        if (!startDate || !endDate) {
            throw utils_1.ApiError.badRequest('Başlangıç ve bitiş tarihi gereklidir');
        }
        let staffWhereClause = { isActive: true };
        if (serviceId) {
            const staffIds = yield StaffService.findAll({
                where: { serviceId, isActive: true },
                attributes: ['staffId']
            });
            staffWhereClause.id = { [sequelize_1.Op.in]: staffIds.map(ss => ss.staffId) };
        }
        const staff = yield Staff.findAll({
            where: staffWhereClause,
            attributes: ['id', 'fullName', 'avatar', 'specialties'],
            order: [['fullName', 'ASC']]
        });
        const businessHours = yield BusinessHours.findAll({
            order: [['dayOfWeek', 'ASC']]
        });
        const result = yield Promise.all(staff.map((staffMember) => __awaiter(void 0, void 0, void 0, function* () {
            const availability = yield getStaffAvailabilityForRange(staffMember.id, new Date(startDate), new Date(endDate), businessHours);
            return {
                staff: {
                    id: staffMember.id,
                    fullName: staffMember.fullName,
                    avatar: staffMember.avatar,
                    specialties: staffMember.specialties
                },
                availability
            };
        })));
        res.json(utils_1.ApiSuccess.list(result, null, 'Tüm personel müsaitlik durumları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getAllStaffAvailability = getAllStaffAvailability;
const getStaffAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId, date, startDate, endDate, type, isAvailable } = req.query;
        const whereConditions = {};
        if (staffId)
            whereConditions.staffId = staffId;
        if (date)
            whereConditions.date = date;
        if (startDate || endDate) {
            whereConditions.date = {};
            if (startDate)
                whereConditions.date[sequelize_1.Op.gte] = startDate;
            if (endDate)
                whereConditions.date[sequelize_1.Op.lte] = endDate;
        }
        if (type)
            whereConditions.type = type;
        if (isAvailable !== undefined)
            whereConditions.isAvailable = isAvailable === 'true';
        const availability = yield StaffAvailability.findAll({
            where: whereConditions,
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'fullName', 'avatar']
                }
            ],
            order: [['date', 'ASC'], ['startTime', 'ASC']]
        });
        res.json(utils_1.ApiSuccess.list(availability, null, 'Müsaitlik durumları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getStaffAvailability = getStaffAvailability;
const createAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId, date, startTime, endTime, lunchBreakStart, lunchBreakEnd, type, notes } = req.body;
        const staff = yield Staff.findByPk(staffId);
        if (!staff || !staff.isActive) {
            throw utils_1.ApiError.notFound('Personel bulunamadı veya aktif değil');
        }
        const dayOfWeek = new Date(date).getDay() || 7;
        const existingAvailability = yield StaffAvailability.findOne({
            where: { staffId, date }
        });
        if (existingAvailability) {
            throw utils_1.ApiError.conflict('Bu tarih için zaten bir müsaitlik kaydı mevcut');
        }
        const availability = yield StaffAvailability.create({
            staffId,
            date,
            dayOfWeek,
            startTime,
            endTime,
            lunchBreakStart,
            lunchBreakEnd,
            isAvailable: type !== 'off',
            type,
            notes
        });
        const createdAvailability = yield StaffAvailability.findByPk(availability.id, {
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'fullName']
                }
            ]
        });
        res.status(201).json(utils_1.ApiSuccess.created(createdAvailability, 'Müsaitlik kaydı başarıyla oluşturuldu'));
    }
    catch (error) {
        next(error);
    }
});
exports.createAvailability = createAvailability;
const bulkCreateAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId, dateRange, workingDays, schedule } = req.body;
        const staff = yield Staff.findByPk(staffId);
        if (!staff || !staff.isActive) {
            throw utils_1.ApiError.notFound('Personel bulunamadı veya aktif değil');
        }
        const dates = (0, eachDayOfInterval_1.eachDayOfInterval)({
            start: new Date(dateRange.startDate),
            end: new Date(dateRange.endDate)
        });
        const availabilityRecords = [];
        for (const date of dates) {
            const dayOfWeek = (0, date_fns_1.getDay)(date) || 7;
            if (workingDays.includes(dayOfWeek)) {
                const dateStr = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
                const existingAvailability = yield StaffAvailability.findOne({
                    where: { staffId, date: dateStr }
                });
                if (!existingAvailability) {
                    availabilityRecords.push({
                        staffId,
                        date: dateStr,
                        dayOfWeek,
                        startTime: schedule.startTime,
                        endTime: schedule.endTime,
                        lunchBreakStart: schedule.lunchBreakStart,
                        lunchBreakEnd: schedule.lunchBreakEnd,
                        isAvailable: true,
                        type: 'default',
                        notes: schedule.notes || null
                    });
                }
            }
        }
        if (availabilityRecords.length === 0) {
            throw utils_1.ApiError.badRequest('Seçilen tarih aralığında oluşturulacak müsaitlik kaydı bulunamadı');
        }
        yield StaffAvailability.bulkCreate(availabilityRecords);
        res.status(201).json(utils_1.ApiSuccess.created({
            count: availabilityRecords.length,
            dateRange,
            workingDays
        }, `${availabilityRecords.length} adet müsaitlik kaydı başarıyla oluşturuldu`));
    }
    catch (error) {
        next(error);
    }
});
exports.bulkCreateAvailability = bulkCreateAvailability;
const updateAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { startTime, endTime, lunchBreakStart, lunchBreakEnd, isAvailable, type, notes } = req.body;
        const availability = yield StaffAvailability.findByPk(id);
        if (!availability) {
            throw utils_1.ApiError.notFound('Müsaitlik kaydı bulunamadı');
        }
        yield availability.update({
            startTime: startTime || availability.startTime,
            endTime: endTime || availability.endTime,
            lunchBreakStart: lunchBreakStart !== undefined ? lunchBreakStart : availability.lunchBreakStart,
            lunchBreakEnd: lunchBreakEnd !== undefined ? lunchBreakEnd : availability.lunchBreakEnd,
            isAvailable: isAvailable !== undefined ? isAvailable : availability.isAvailable,
            type: type || availability.type,
            notes: notes !== undefined ? notes : availability.notes
        });
        const updatedAvailability = yield StaffAvailability.findByPk(id, {
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'fullName']
                }
            ]
        });
        res.json(utils_1.ApiSuccess.updated(updatedAvailability, 'Müsaitlik kaydı başarıyla güncellendi'));
    }
    catch (error) {
        next(error);
    }
});
exports.updateAvailability = updateAvailability;
const deleteAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const availability = yield StaffAvailability.findByPk(id);
        if (!availability) {
            throw utils_1.ApiError.notFound('Müsaitlik kaydı bulunamadı');
        }
        yield availability.destroy();
        res.json(utils_1.ApiSuccess.deleted('Müsaitlik kaydı başarıyla silindi'));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAvailability = deleteAvailability;
function getStaffAvailabilityForRange(staffId, startDate, endDate, businessHours) {
    return __awaiter(this, void 0, void 0, function* () {
        const dates = (0, eachDayOfInterval_1.eachDayOfInterval)({ start: startDate, end: endDate });
        const staffAvailability = yield StaffAvailability.findAll({
            where: {
                staffId,
                date: {
                    [sequelize_1.Op.between]: [(0, date_fns_1.format)(startDate, 'yyyy-MM-dd'), (0, date_fns_1.format)(endDate, 'yyyy-MM-dd')]
                }
            }
        });
        const appointments = yield Appointment.findAll({
            where: {
                staffId,
                appointmentDate: {
                    [sequelize_1.Op.between]: [(0, date_fns_1.format)(startDate, 'yyyy-MM-dd'), (0, date_fns_1.format)(endDate, 'yyyy-MM-dd')]
                }
            },
            include: [
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'title', 'duration']
                }
            ]
        });
        return dates.map(date => {
            const dateStr = (0, date_fns_1.format)(date, 'yyyy-MM-dd');
            const dayOfWeek = date.getDay() || 7;
            const customAvailability = staffAvailability.find(a => (0, date_fns_1.format)(new Date(a.date), 'yyyy-MM-dd') === dateStr);
            const defaultHours = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
            let dayAvailability;
            if (customAvailability) {
                dayAvailability = {
                    date: dateStr,
                    dayOfWeek,
                    isAvailable: customAvailability.isAvailable,
                    type: customAvailability.type,
                    startTime: customAvailability.startTime,
                    endTime: customAvailability.endTime,
                    lunchBreakStart: customAvailability.lunchBreakStart,
                    lunchBreakEnd: customAvailability.lunchBreakEnd,
                    notes: customAvailability.notes,
                    isCustom: true
                };
            }
            else if (defaultHours && !defaultHours.isClosed) {
                dayAvailability = {
                    date: dateStr,
                    dayOfWeek,
                    isAvailable: true,
                    type: 'default',
                    startTime: defaultHours.openTime,
                    endTime: defaultHours.closeTime,
                    isCustom: false
                };
            }
            else {
                dayAvailability = {
                    date: dateStr,
                    dayOfWeek,
                    isAvailable: false,
                    type: 'off',
                    isCustom: false
                };
            }
            const dayAppointments = appointments.filter(a => (0, date_fns_1.format)(new Date(a.appointmentDate), 'yyyy-MM-dd') === dateStr);
            return Object.assign(Object.assign({}, dayAvailability), { appointments: dayAppointments.map(a => ({
                    id: a.id,
                    startTime: a.startTime,
                    endTime: a.endTime,
                    service: a.service ? {
                        id: a.service.id,
                        title: a.service.title,
                        duration: a.service.duration
                    } : null
                })) });
        });
    });
}
//# sourceMappingURL=availabilityController.js.map