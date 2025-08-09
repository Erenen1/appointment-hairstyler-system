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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableStaffByDate = exports.updateStaffAvailability = exports.createAutoAvailability = exports.getAvailabilityByDateRange = exports.getStaffAvailableSlots = void 0;
const staff_availability_service_1 = require("../modules/staff/staff-availability.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const controllerUtils_1 = require("../utils/controllerUtils");
const staffAvailabilityService = new staff_availability_service_1.StaffAvailabilityService();
const getStaffAvailableSlots = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId, date } = req.params;
        const { serviceId } = req.query;
        if (!staffId || !date) {
            res.status(400).json(ApiError_1.ApiError.badRequest('StaffId ve date parametreleri gereklidir').toJSON());
            return;
        }
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            res.status(400).json(ApiError_1.ApiError.badRequest('Geçersiz tarih formatı. YYYY-MM-DD formatında olmalıdır').toJSON());
            return;
        }
        const availableSlots = yield staffAvailabilityService.getAvailableTimeSlots({
            staffId,
            date,
            serviceId: serviceId
        });
        res.json(ApiResponse_1.ApiSuccess.list(availableSlots, undefined, 'Müsait saatler başarıyla getirildi'));
    }
    catch (error) {
        (0, controllerUtils_1.handleControllerError)(error, res, 'Müsait saatler getirilirken hata oluştu');
    }
});
exports.getStaffAvailableSlots = getStaffAvailableSlots;
const getAvailabilityByDateRange = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            res.status(400).json(ApiError_1.ApiError.badRequest('startDate ve endDate parametreleri gereklidir').toJSON());
            return;
        }
        const availabilities = yield staffAvailabilityService.getStaffAvailabilityByDateRange(startDate, endDate);
        res.json(ApiResponse_1.ApiSuccess.list(availabilities, undefined, 'Müsaitlik verileri başarıyla getirildi'));
    }
    catch (error) {
        (0, controllerUtils_1.handleControllerError)(error, res, 'Müsaitlik verileri getirilirken hata oluştu');
    }
});
exports.getAvailabilityByDateRange = getAvailabilityByDateRange;
const createAutoAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId, startDate, endDate, weekDays } = req.body;
        if (!staffId || !startDate || !endDate) {
            res.status(400).json(ApiError_1.ApiError.badRequest('staffId, startDate ve endDate alanları gereklidir').toJSON());
            return;
        }
        yield staffAvailabilityService.createAutoAvailability({
            staffId,
            startDate,
            endDate,
            weekDays
        });
        res.json(ApiResponse_1.ApiSuccess.message('Otomatik müsaitlik kayıtları başarıyla oluşturuldu'));
    }
    catch (error) {
        (0, controllerUtils_1.handleControllerError)(error, res, 'Otomatik müsaitlik oluşturulurken hata oluştu');
    }
});
exports.createAutoAvailability = createAutoAvailability;
const updateStaffAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId, date } = req.params;
        const updates = req.body;
        if (!staffId || !date) {
            res.status(400).json(ApiError_1.ApiError.badRequest('StaffId ve date parametreleri gereklidir').toJSON());
            return;
        }
        const updatedAvailability = yield staffAvailabilityService.updateStaffAvailability(staffId, date, updates);
        res.json(ApiResponse_1.ApiSuccess.updated(updatedAvailability, 'Müsaitlik durumu başarıyla güncellendi'));
    }
    catch (error) {
        (0, controllerUtils_1.handleControllerError)(error, res, 'Müsaitlik güncellenirken hata oluştu');
    }
});
exports.updateStaffAvailability = updateStaffAvailability;
const getAvailableStaffByDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.params;
        const { serviceId } = req.query;
        if (!date) {
            res.status(400).json(ApiError_1.ApiError.badRequest('Date parametresi gereklidir').toJSON());
            return;
        }
        const availabilities = yield staffAvailabilityService.getStaffAvailabilityByDateRange(date, date);
        const staffWithSlots = yield Promise.all(availabilities.map((availability) => __awaiter(void 0, void 0, void 0, function* () {
            const slots = yield staffAvailabilityService.getAvailableTimeSlots({
                staffId: availability.staffId,
                date: date,
                serviceId: serviceId
            });
            return {
                staff: availability.staff,
                availability: {
                    date: availability.date,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                    isAvailable: availability.isAvailable
                },
                availableSlots: slots
            };
        })));
        const availableStaff = staffWithSlots.filter(staff => staff.availableSlots.length > 0);
        res.json(ApiResponse_1.ApiSuccess.list(availableStaff, undefined, 'Müsait personeller başarıyla getirildi'));
    }
    catch (error) {
        (0, controllerUtils_1.handleControllerError)(error, res, 'Müsait personeller getirilirken hata oluştu');
    }
});
exports.getAvailableStaffByDate = getAvailableStaffByDate;
//# sourceMappingURL=availabilityController.js.map