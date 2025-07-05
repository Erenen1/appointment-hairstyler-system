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
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const customerValidation_1 = require("../validations/customerValidation");
const index_1 = __importDefault(require("../models/index"));
const { Customer, Appointment, Service, Staff } = index_1.default;
const getCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = customerValidation_1.customerListQuerySchema.validate(req.query);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { page, limit, search, sortBy, sortOrder } = value;
        const whereConditions = {};
        if (search) {
            whereConditions[sequelize_1.Op.or] = [
                { fullName: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { phone: { [sequelize_1.Op.iLike]: `%${search}%` } }
            ];
        }
        const offset = (page - 1) * limit;
        const orderBy = [];
        if (sortBy === 'name') {
            orderBy.push(['fullName', sortOrder.toUpperCase()]);
        }
        else if (sortBy === 'totalSpent') {
            orderBy.push([(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('appointments.price')), sortOrder.toUpperCase()]);
        }
        else if (sortBy === 'lastVisit') {
            orderBy.push([(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)('appointments.appointmentDate')), sortOrder.toUpperCase()]);
        }
        else {
            orderBy.push([sortBy, sortOrder.toUpperCase()]);
        }
        const { count, rows } = yield Customer.findAndCountAll({
            where: whereConditions,
            attributes: [
                'id', 'fullName', 'email', 'phone', 'createdAt',
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('appointments.id')), 'visitCount'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('appointments.price')), 'totalSpent'],
                [(0, sequelize_1.fn)('MAX', (0, sequelize_1.col)('appointments.appointmentDate')), 'lastVisit']
            ],
            include: [
                {
                    model: Appointment,
                    as: 'appointments',
                    attributes: [],
                    required: false
                }
            ],
            group: ['Customer.id'],
            order: orderBy,
            limit,
            offset,
            subQuery: false,
            distinct: true
        });
        const totalPages = Math.ceil(count.length / limit);
        const paginationInfo = {
            currentPage: page,
            totalPages,
            totalItems: count.length,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
        res.json(utils_1.ApiSuccess.list(rows, paginationInfo, 'Müşteriler başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getCustomers = getCustomers;
const getCustomerById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = customerValidation_1.customerIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { id } = value;
        const customer = yield Customer.findByPk(id, {
            include: [
                {
                    model: Appointment,
                    as: 'appointments',
                    include: [
                        {
                            model: Service,
                            as: 'service',
                            attributes: ['id', 'title', 'price']
                        },
                        {
                            model: Staff,
                            as: 'staff',
                            attributes: ['id', 'fullName']
                        }
                    ],
                    order: [['appointmentDate', 'DESC']]
                }
            ]
        });
        if (!customer) {
            throw utils_1.ApiError.notFound('Müşteri bulunamadı');
        }
        const completedAppointments = customer.appointments;
        const totalSpent = completedAppointments.reduce((sum, apt) => sum + (apt.price || 0), 0);
        const averageSpent = completedAppointments.length > 0
            ? totalSpent / completedAppointments.length
            : 0;
        const serviceCount = {};
        completedAppointments.forEach((apt) => {
            var _a;
            const serviceName = (_a = apt.service) === null || _a === void 0 ? void 0 : _a.title;
            if (serviceName) {
                serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
            }
        });
        const favoriteServices = Object.entries(serviceCount)
            .map(([serviceName, count]) => ({ serviceName, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        const customerDetail = Object.assign(Object.assign({}, customer.toJSON()), { totalVisits: completedAppointments.length, totalSpent, averageSpent: Math.round(averageSpent * 100) / 100, favoriteServices });
        res.json(utils_1.ApiSuccess.item(customerDetail, 'Müşteri detayları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getCustomerById = getCustomerById;
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = customerValidation_1.createCustomerSchema.validate(req.body);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { fullName, email, phone, notes } = value;
        const existingCustomer = yield Customer.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });
        if (existingCustomer) {
            if (existingCustomer.email === email) {
                throw utils_1.ApiError.conflict('Bu e-posta adresi zaten kullanımda');
            }
            if (existingCustomer.phone === phone) {
                throw utils_1.ApiError.conflict('Bu telefon numarası zaten kullanımda');
            }
        }
        const customer = yield Customer.create({
            fullName,
            email,
            phone,
            notes
        });
        res.status(201).json(utils_1.ApiSuccess.created(customer, 'Müşteri başarıyla oluşturuldu'));
    }
    catch (error) {
        next(error);
    }
});
exports.createCustomer = createCustomer;
const updateCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error: paramsError, value: paramsValue } = customerValidation_1.customerIdSchema.validate(req.params);
        if (paramsError) {
            throw utils_1.ApiError.fromJoi(paramsError);
        }
        const { error: bodyError, value: bodyValue } = customerValidation_1.updateCustomerSchema.validate(req.body);
        if (bodyError) {
            throw utils_1.ApiError.fromJoi(bodyError);
        }
        const { id } = paramsValue;
        const updateData = bodyValue;
        const customer = yield Customer.findByPk(id);
        if (!customer) {
            throw utils_1.ApiError.notFound('Müşteri bulunamadı');
        }
        if (updateData.email || updateData.phone) {
            const whereCondition = {
                id: { [sequelize_1.Op.ne]: id }
            };
            const orConditions = [];
            if (updateData.email) {
                orConditions.push({ email: updateData.email });
            }
            if (updateData.phone) {
                orConditions.push({ phone: updateData.phone });
            }
            if (orConditions.length > 0) {
                whereCondition[sequelize_1.Op.or] = orConditions;
            }
            const existingCustomer = yield Customer.findOne({
                where: whereCondition
            });
            if (existingCustomer) {
                if (existingCustomer.email === updateData.email) {
                    throw utils_1.ApiError.conflict('Bu e-posta adresi başka bir müşteri tarafından kullanılıyor');
                }
                if (existingCustomer.phone === updateData.phone) {
                    throw utils_1.ApiError.conflict('Bu telefon numarası başka bir müşteri tarafından kullanılıyor');
                }
            }
        }
        yield customer.update(updateData);
        res.json(utils_1.ApiSuccess.updated(customer, 'Müşteri başarıyla güncellendi'));
    }
    catch (error) {
        next(error);
    }
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = customerValidation_1.customerIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { id } = value;
        const customer = yield Customer.findByPk(id);
        if (!customer) {
            throw utils_1.ApiError.notFound('Müşteri bulunamadı');
        }
        const activeAppointments = yield Appointment.count({
            where: {
                customerId: id
            }
        });
        if (activeAppointments > 0) {
            throw utils_1.ApiError.badRequest('Müşterinin randevuları olduğu için silinemez');
        }
        yield customer.destroy();
        res.json(utils_1.ApiSuccess.deleted('Müşteri başarıyla silindi'));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCustomer = deleteCustomer;
//# sourceMappingURL=customerController.js.map