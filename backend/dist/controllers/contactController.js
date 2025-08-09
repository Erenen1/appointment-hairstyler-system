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
exports.createContact = exports.getContactStats = exports.deleteContactMessage = exports.updateContactMessageStatus = exports.getContactMessageById = exports.getContactMessages = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../models/index"));
const { ContactMessage } = index_1.default;
const buildWhereConditions = (filters) => {
    const { search, category, startDate, endDate } = filters;
    const conditions = {};
    if (search) {
        conditions[sequelize_1.Op.or] = ['fullName', 'email', 'subject', 'message'].map(field => ({
            [field]: { [sequelize_1.Op.like]: `%${search}%` }
        }));
    }
    if (category)
        conditions.category = category;
    if (startDate || endDate) {
        conditions.createdAt = {};
        if (startDate)
            conditions.createdAt[sequelize_1.Op.gte] = startDate;
        if (endDate)
            conditions.createdAt[sequelize_1.Op.lte] = endDate;
    }
    return conditions;
};
const getContactMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, category, startDate, endDate } = req.query;
        const filters = { search, category, startDate, endDate };
        const whereConditions = buildWhereConditions(filters);
        const offset = (Number(page) - 1) * Number(limit);
        const orderBy = [[sortBy === 'name' ? 'fullName' : sortBy, String(sortOrder).toUpperCase()]];
        const { count, rows } = yield ContactMessage.findAndCountAll({
            where: whereConditions,
            order: orderBy,
            limit: Number(limit),
            offset,
            attributes: { exclude: ['ipAddress', 'userAgent'] }
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
        res.json(utils_1.ApiSuccess.list(rows, paginationInfo, 'İletişim mesajları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getContactMessages = getContactMessages;
const getContactMessageById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield ContactMessage.findByPk(id);
        if (!message)
            throw utils_1.ApiError.notFound('İletişim mesajı bulunamadı');
        if (!message.isRead) {
            yield message.update({
                isRead: true
            });
        }
        res.json(utils_1.ApiSuccess.item(message, 'İletişim mesajı başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getContactMessageById = getContactMessageById;
const STATUS_TRANSITIONS = {
    'new': ['read', 'replied', 'closed'],
    'read': ['replied', 'closed'],
    'replied': ['closed'],
    'closed': []
};
const getStatusUpdateData = (status, userId) => {
    const updateData = { status, updatedBy: userId };
    const statusActions = {
        'read': { readAt: new Date(), readBy: userId },
        'replied': { repliedAt: new Date(), repliedBy: userId },
        'closed': { closedAt: new Date(), closedBy: userId }
    };
    return Object.assign(Object.assign({}, updateData), statusActions[status]);
};
const updateContactMessageStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;
        const message = yield ContactMessage.findByPk(id);
        if (!message)
            throw utils_1.ApiError.notFound('İletişim mesajı bulunamadı');
        if (!STATUS_TRANSITIONS[message.status].includes(status)) {
            throw utils_1.ApiError.badRequest(`${message.status} durumundan ${status} durumuna geçiş yapılamaz`);
        }
        const updateData = Object.assign(Object.assign({}, getStatusUpdateData(status, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)), { adminNotes });
        yield message.update(updateData);
        res.json(new utils_1.ApiSuccess(`Mesaj durumu "${status}" olarak güncellendi`, { message }));
    }
    catch (error) {
        next(error);
    }
});
exports.updateContactMessageStatus = updateContactMessageStatus;
const deleteContactMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const message = yield ContactMessage.findByPk(id);
        if (!message)
            throw utils_1.ApiError.notFound('İletişim mesajı bulunamadı');
        yield message.destroy();
        res.json(utils_1.ApiSuccess.deleted('İletişim mesajı başarıyla silindi'));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteContactMessage = deleteContactMessage;
const getContactStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const [totalMessages, unreadMessages, messagesThisMonth, dailyStats] = yield Promise.all([
            ContactMessage.count(),
            ContactMessage.count({ where: { isRead: false } }),
            ContactMessage.count({ where: { createdAt: { [sequelize_1.Op.gte]: thirtyDaysAgo } } }),
            ContactMessage.findAll({
                attributes: [[(0, sequelize_1.fn)('DATE', (0, sequelize_1.col)('createdAt')), 'date'], [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count']],
                where: { createdAt: { [sequelize_1.Op.gte]: sevenDaysAgo } },
                group: [(0, sequelize_1.fn)('DATE', (0, sequelize_1.col)('createdAt'))],
                order: [[(0, sequelize_1.fn)('DATE', (0, sequelize_1.col)('createdAt')), 'ASC']],
                raw: true
            })
        ]);
        const statsData = {
            summary: {
                totalMessages,
                unreadMessages,
                messagesThisMonth,
                responseRate: totalMessages > 0 ? Math.round(((totalMessages - unreadMessages) / totalMessages) * 100) : 0
            },
            dailyStats
        };
        res.json(utils_1.ApiSuccess.item(statsData, 'İletişim istatistikleri başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getContactStats = getContactStats;
const createContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, subject, message } = req.body;
        if (!fullName || !email || !subject || !message) {
            throw utils_1.ApiError.badRequest('Ad-soyad, e-posta, konu ve mesaj alanları zorunludur');
        }
        const clientInfo = {
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        };
        const contactMessage = yield ContactMessage.create(Object.assign(Object.assign({ fullName,
            email,
            subject,
            message }, clientInfo), { status: 'new', isRead: false }));
        res.status(201).json(utils_1.ApiSuccess.created(contactMessage, 'İletişim mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'));
    }
    catch (error) {
        next(error);
    }
});
exports.createContact = createContact;
//# sourceMappingURL=contactController.js.map