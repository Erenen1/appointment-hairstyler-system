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
exports.getRecentAppointments = exports.getPopularServices = exports.getRevenueChart = exports.getDashboardStats = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
const index_1 = __importDefault(require("../models/index"));
const { Appointment, Customer, Service, Staff } = index_1.default;
const getDashboardStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        const startOfToday = (0, date_fns_1.startOfDay)(today);
        const endOfToday = (0, date_fns_1.endOfDay)(today);
        const startOfCurrentMonth = (0, date_fns_1.startOfMonth)(today);
        const endOfCurrentMonth = (0, date_fns_1.endOfMonth)(today);
        const startOfLastMonth = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(today, 1));
        const endOfLastMonth = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(today, 1));
        const todaysAppointments = yield Appointment.findAll({
            where: {
                appointmentDate: {
                    [sequelize_1.Op.between]: [startOfToday, endOfToday]
                }
            }
        });
        const todaysStats = {
            total: todaysAppointments.length
        };
        const totalCustomers = yield Customer.count();
        const newCustomersThisMonth = yield Customer.count({
            where: {
                createdAt: {
                    [sequelize_1.Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
                }
            }
        });
        const threeMonthsAgo = (0, date_fns_1.subMonths)(today, 3);
        const activeCustomers = yield Customer.count({
            include: [{
                    model: Appointment,
                    as: 'appointments',
                    where: {
                        appointmentDate: {
                            [sequelize_1.Op.gte]: threeMonthsAgo
                        }
                    },
                    required: true
                }]
        });
        const currentMonthRevenue = (yield Appointment.sum('price', {
            where: {
                appointmentDate: {
                    [sequelize_1.Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
                }
            }
        })) || 0;
        const lastMonthRevenue = (yield Appointment.sum('price', {
            where: {
                appointmentDate: {
                    [sequelize_1.Op.between]: [startOfLastMonth, endOfLastMonth]
                }
            }
        })) || 0;
        const revenueGrowth = lastMonthRevenue > 0
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : 0;
        const totalCompletedAppointments = yield Appointment.count();
        const thisMonthCompleted = yield Appointment.count({
            where: {
                appointmentDate: {
                    [sequelize_1.Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
                }
            }
        });
        const lastMonthCompleted = yield Appointment.count({
            where: {
                appointmentDate: {
                    [sequelize_1.Op.between]: [startOfLastMonth, endOfLastMonth]
                }
            }
        });
        const dashboardStats = {
            todaysAppointments: todaysStats,
            totalCustomers: {
                total: totalCustomers,
                newThisMonth: newCustomersThisMonth,
                activeCustomers: activeCustomers
            },
            monthlyRevenue: {
                currentMonth: Number(currentMonthRevenue),
                lastMonth: Number(lastMonthRevenue),
                growth: Math.round(revenueGrowth * 100) / 100
            },
            completedAppointments: {
                total: totalCompletedAppointments,
                thisMonth: thisMonthCompleted,
                lastMonth: lastMonthCompleted
            }
        };
        res.json(utils_1.ApiSuccess.item(dashboardStats, 'Dashboard istatistikleri başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getDashboardStats = getDashboardStats;
const getRevenueChart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { months = 6 } = req.query;
        const monthCount = parseInt(months) || 6;
        const endDate = (0, date_fns_1.endOfMonth)(new Date());
        const startDate = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(new Date(), monthCount - 1));
        const revenueData = yield Appointment.findAll({
            attributes: [
                [(0, sequelize_1.fn)('DATE_TRUNC', 'month', (0, sequelize_1.col)('appointmentDate')), 'month'],
                [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('price')), 'revenue']
            ],
            where: {
                appointmentDate: {
                    [sequelize_1.Op.between]: [startDate, endDate]
                }
            },
            group: [(0, sequelize_1.fn)('DATE_TRUNC', 'month', (0, sequelize_1.col)('appointmentDate'))],
            order: [[(0, sequelize_1.fn)('DATE_TRUNC', 'month', (0, sequelize_1.col)('appointmentDate')), 'ASC']],
            raw: true
        });
        const monthNames = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        const chartData = {
            labels: revenueData.map((item) => {
                const date = new Date(item.month);
                return monthNames[date.getMonth()];
            }),
            datasets: [{
                    label: 'Aylık Gelir (₺)',
                    data: revenueData.map((item) => Number(item.revenue) || 0),
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    fill: true
                }]
        };
        res.json(utils_1.ApiSuccess.item(chartData, 'Gelir grafiği verileri başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getRevenueChart = getRevenueChart;
const getPopularServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 5 } = req.query;
        const limitCount = parseInt(limit) || 5;
        const popularServices = yield Service.findAll({
            attributes: [
                'id',
                'title',
                'price',
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('appointments.id')), 'appointmentCount']
            ],
            include: [{
                    model: Appointment,
                    as: 'appointments',
                    attributes: [],
                    required: false
                }],
            group: ['Service.id'],
            order: [[(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('appointments.id')), 'DESC']],
            limit: limitCount,
            raw: true
        });
        res.json(utils_1.ApiSuccess.list(popularServices, null, 'Popüler hizmetler başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getPopularServices = getPopularServices;
const getRecentAppointments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 10 } = req.query;
        const limitCount = parseInt(limit) || 10;
        const recentAppointments = yield Appointment.findAll({
            include: [
                {
                    model: Customer,
                    as: 'customer',
                    attributes: ['id', 'fullName', 'phone']
                },
                {
                    model: Service,
                    as: 'service',
                    attributes: ['id', 'title']
                },
                {
                    model: Staff,
                    as: 'staff',
                    attributes: ['id', 'fullName']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: limitCount
        });
        const formattedAppointments = recentAppointments.map((appointment) => ({
            id: appointment.id,
            customer: appointment.customer.fullName,
            service: appointment.service.title,
            staff: appointment.staff.fullName,
            date: (0, date_fns_1.format)(new Date(appointment.appointmentDate), 'dd/MM/yyyy'),
            time: appointment.startTime,
            price: Number(appointment.price),
            createdAt: appointment.createdAt
        }));
        res.json(utils_1.ApiSuccess.list(formattedAppointments, null, 'Son randevular başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getRecentAppointments = getRecentAppointments;
//# sourceMappingURL=dashboardController.js.map