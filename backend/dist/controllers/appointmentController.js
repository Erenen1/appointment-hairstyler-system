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
exports.getAppointmentById = exports.getCalendarAppointments = exports.createAppointment = exports.getAppointments = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const index_1 = __importDefault(require("../models/index"));
const { Appointment, Customer, Service, Staff, AppointmentHistory, StaffService } = index_1.default;
const getAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, startDate, endDate, staffId, customerId, serviceId, sortBy = 'appointmentDate', sortOrder = 'desc' } = req.query;
        const whereConditions = {};
        if (startDate || endDate) {
            whereConditions.appointmentDate = {};
            if (startDate)
                whereConditions.appointmentDate[sequelize_1.Op.gte] = startDate;
            if (endDate)
                whereConditions.appointmentDate[sequelize_1.Op.lte] = endDate;
        }
        if (staffId)
            whereConditions.staffId = staffId;
        if (customerId)
            whereConditions.customerId = customerId;
        if (serviceId)
            whereConditions.serviceId = serviceId;
        const includeConditions = [
            {
                model: Customer,
                as: 'customer',
                attributes: ['id', 'fullName', 'email', 'phone']
            },
            {
                model: Service,
                as: 'service',
                attributes: ['id', 'title', 'price', 'duration']
            },
            {
                model: Staff,
                as: 'staff',
                attributes: ['id', 'fullName', 'specialties']
            },
        ];
        const offset = (Number(page) - 1) * Number(limit);
        const { count, rows: appointments } = yield Appointment.findAndCountAll({
            where: whereConditions,
            include: includeConditions,
            limit: Number(limit),
            offset,
            order: [[sortBy === 'customer_name' ? [{ model: Customer, as: 'customer' }, 'fullName'] :
                        sortBy === 'service_name' ? [{ model: Service, as: 'service' }, 'title'] :
                            sortBy, String(sortOrder).toUpperCase()]],
            distinct: true
        });
        const formattedAppointments = appointments.map((appointment) => ({
            id: appointment.id,
            customerId: appointment.customerId,
            customer: {
                id: appointment.customer.id,
                fullName: appointment.customer.fullName,
                email: appointment.customer.email,
                phone: appointment.customer.phone,
            },
            staffId: appointment.staffId,
            staff: {
                id: appointment.staff.id,
                specialties: appointment.staff.specialties,
                fullName: appointment.staff.fullname
            },
            serviceId: appointment.serviceId,
            service: {
                id: appointment.service.id,
                title: appointment.service.title,
                price: Number(appointment.service.price),
                duration: appointment.service.duration
            },
            appointmentDate: (0, date_fns_1.format)(new Date(appointment.appointmentDate), 'yyyy-MM-dd'),
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            price: Number(appointment.price),
            notes: appointment.notes,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt
        }));
        const totalPages = Math.ceil(count / Number(limit));
        const paginationInfo = {
            currentPage: Number(page),
            totalPages,
            totalItems: count,
            itemsPerPage: Number(limit),
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1
        };
        res.json(utils_1.ApiSuccess.list(formattedAppointments, paginationInfo, 'Randevu listesi başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getAppointments = getAppointments;
const createAppointment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { customer: customerData, serviceId, staffId, appointmentDate, startTime, notes } = req.body;
        const service = yield Service.findByPk(serviceId);
        if (!service) {
            throw utils_1.ApiError.notFound('Hizmet bulunamadı');
        }
        const staff = yield Staff.findByPk(staffId);
        if (!staff || !staff.isActive) {
            throw utils_1.ApiError.notFound('Personel bulunamadı veya aktif değil');
        }
        const staffService = yield StaffService.findOne({
            where: {
                staffId: staffId,
                serviceId: serviceId,
                isActive: true
            }
        });
        if (!staffService) {
            throw utils_1.ApiError.badRequest('Bu personel seçilen hizmeti veremiyor');
        }
        const appointmentDateStr = (0, date_fns_1.format)(new Date(appointmentDate), 'yyyy-MM-dd');
        const startDateTime = new Date(`${appointmentDateStr}T${startTime}:00`);
        const endDateTime = (0, date_fns_1.addMinutes)(startDateTime, service.duration);
        const endTime = (0, date_fns_1.format)(endDateTime, 'HH:mm');
        const conflictingAppointment = yield Appointment.findOne({
            where: {
                staffId: staffId,
                appointmentDate: appointmentDateStr,
                [sequelize_1.Op.and]: [
                    {
                        [sequelize_1.Op.or]: [
                            {
                                startTime: { [sequelize_1.Op.lte]: startTime },
                                endTime: { [sequelize_1.Op.gt]: startTime }
                            },
                            {
                                startTime: { [sequelize_1.Op.lt]: endTime },
                                endTime: { [sequelize_1.Op.gte]: endTime }
                            },
                            {
                                startTime: { [sequelize_1.Op.gte]: startTime },
                                endTime: { [sequelize_1.Op.lte]: endTime }
                            }
                        ]
                    }
                ]
            }
        });
        if (conflictingAppointment) {
            throw utils_1.ApiError.conflict('Bu saatte başka bir randevu mevcut');
        }
        let customer = yield Customer.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email: customerData.email },
                    { phone: customerData.phone }
                ]
            }
        });
        if (!customer) {
            customer = yield Customer.create({
                fullName: customerData.fullName,
                email: customerData.email,
                phone: customerData.phone,
            });
        }
        const appointment = yield Appointment.create({
            customerId: customer.id,
            staffId: staffId,
            serviceId: serviceId,
            appointmentDate: appointmentDateStr,
            startTime: startTime,
            endTime: endTime,
            price: service.price,
            notes: notes || '',
            createdByAdmin: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userType) === 'admin' ? req.user.id : null
        });
        yield AppointmentHistory.create({
            appointmentId: appointment.id,
            notes: 'Randevu oluşturuldu',
            createdByAdmin: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userType) === 'admin' ? req.user.id : null
        });
        res.status(201).json(utils_1.ApiSuccess.created(appointment, 'Randevu başarıyla oluşturuldu'));
    }
    catch (error) {
        next(error);
    }
});
exports.createAppointment = createAppointment;
const getCalendarAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            throw utils_1.ApiError.badRequest('Başlangıç ve bitiş tarihi gereklidir');
        }
        const appointments = yield Appointment.findAll({
            where: {
                appointmentDate: {
                    [sequelize_1.Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'fullName', 'email', 'phone']
                },
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'title', 'duration']
                },
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'fullName']
                }
            ],
            order: [
                ['appointmentDate', 'ASC'],
                ['startTime', 'ASC']
            ]
        });
        const calendarEvents = appointments.map(appointment => ({
            id: appointment.id,
            title: `${appointment.customer.fullName} - ${appointment.service.title}`,
            start: `${appointment.appointmentDate}T${appointment.startTime}`,
            end: `${appointment.appointmentDate}T${appointment.endTime}`,
            resourceId: appointment.staffId,
            extendedProps: {
                customer: appointment.customer,
                service: appointment.service,
                staff: appointment.staff,
                notes: appointment.notes
            }
        }));
        res.json(utils_1.ApiSuccess.list(calendarEvents, null, 'Takvim randevuları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getCalendarAppointments = getCalendarAppointments;
const getAppointmentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const appointment = yield Appointment.findByPk(id, {
            include: [
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'fullName', 'email', 'phone']
                },
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'title', 'price', 'duration']
                },
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'fullName', 'specialties']
                },
                {
                    model: AppointmentHistory,
                    as: 'history',
                    attributes: ['id', 'notes', 'createdAt'],
                    include: [
                        {
                            model: index_1.default.Admin,
                            as: 'createdBy',
                            attributes: ['id', 'fullName']
                        }
                    ]
                }
            ]
        });
        if (!appointment) {
            throw utils_1.ApiError.notFound('Randevu bulunamadı');
        }
        res.json(utils_1.ApiSuccess.item(appointment, 'Randevu detayları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getAppointmentById = getAppointmentById;
//# sourceMappingURL=appointmentController.js.map