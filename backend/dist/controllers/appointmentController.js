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
const appointmentValidation_1 = require("../validations/appointmentValidation");
const index_1 = __importDefault(require("../models/index"));
const { Appointment, Customer, Service, Staff, AppointmentHistory, StaffService } = index_1.default;
const getAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = appointmentValidation_1.appointmentListQuerySchema.validate(req.query);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { page, limit, startDate, endDate, staffId, customerId, serviceId, sortBy, sortOrder } = value;
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
        const offset = (page - 1) * limit;
        const { count, rows: appointments } = yield Appointment.findAndCountAll({
            where: whereConditions,
            include: includeConditions,
            limit,
            offset,
            order: [[sortBy === 'customer_name' ? [{ model: Customer, as: 'customer' }, 'fullName'] :
                        sortBy === 'service_name' ? [{ model: Service, as: 'service' }, 'title'] :
                            sortBy, sortOrder.toUpperCase()]],
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
        const totalPages = Math.ceil(count / limit);
        const paginationInfo = {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
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
        const { error, value } = appointmentValidation_1.createAppointmentSchema.validate(req.body);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { customer: customerData, serviceId, staffId, appointmentDate, startTime, notes } = value;
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
                notes: customerData.notes
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
        const fullAppointment = yield Appointment.findByPk(appointment.id, {
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
                }
            ]
        });
        res.status(201).json(utils_1.ApiSuccess.created(fullAppointment, 'Randevu başarıyla oluşturuldu'));
    }
    catch (error) {
        next(error);
    }
});
exports.createAppointment = createAppointment;
const getCalendarAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = appointmentValidation_1.calendarQuerySchema.validate(req.query);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { startDate, endDate, staffId } = value;
        const whereConditions = {
            appointmentDate: {
                [sequelize_1.Op.between]: [startDate, endDate]
            }
        };
        if (staffId) {
            whereConditions.staffId = staffId;
        }
        const appointments = yield Appointment.findAll({
            where: whereConditions,
            include: [
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['fullName', 'phone']
                },
                {
                    model: Service,
                    as: 'service',
                    attributes: ['title']
                },
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['fullName']
                }
            ],
            order: [['appointmentDate', 'ASC'], ['startTime', 'ASC']]
        });
        const calendarEvents = appointments.map((appointment) => {
            const startDateTime = `${appointment.appointmentDate}T${appointment.startTime}:00`;
            const endDateTime = `${appointment.appointmentDate}T${appointment.endTime}:00`;
            return {
                id: appointment.id,
                title: `${appointment.customer.fullName} - ${appointment.service.title}`,
                start: startDateTime,
                end: endDateTime,
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                extendedProps: {
                    customerName: appointment.customer.fullName,
                    serviceName: appointment.service.title,
                    staffName: appointment.staff.fullName,
                    phone: appointment.customer.phone,
                    price: Number(appointment.price),
                    notes: appointment.notes
                }
            };
        });
        res.json(utils_1.ApiSuccess.item(calendarEvents, 'Takvim randevuları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getCalendarAppointments = getCalendarAppointments;
const getAppointmentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = appointmentValidation_1.appointmentIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const appointment = yield Appointment.findByPk(value.id, {
            include: [
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'fullName', 'email', 'phone']
                },
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'title', 'price', 'duration', 'description']
                },
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'fullName', 'specialties', 'phone']
                },
                {
                    model: AppointmentHistory,
                    as: 'history',
                    order: [['createdAt', 'DESC']]
                }
            ]
        });
        if (!appointment) {
            throw utils_1.ApiError.notFound('Randevu bulunamadı');
        }
        res.json(utils_1.ApiSuccess.item(appointment, 'Randevu detayı başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getAppointmentById = getAppointmentById;
//# sourceMappingURL=appointmentController.js.map