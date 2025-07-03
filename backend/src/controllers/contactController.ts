import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col } from 'sequelize';
import { 
  contactMessagesListQuerySchema,
  contactMessageIdSchema,
  updateContactMessageStatusSchema
} from '../validations/contactValidation';

import db from '../models/index';
const { ContactMessage } = db;

const buildWhereConditions = (filters: any) => {
  const { search, category, startDate, endDate } = filters;
  const conditions: any = {};

  if (search) {
    conditions[Op.or] = ['fullName', 'email', 'subject', 'message'].map(field => ({
      [field]: { [Op.like]: `%${search}%` }
    }));
  }

  if (category) conditions.category = category;
  if (startDate || endDate) {
    conditions.createdAt = {};
    if (startDate) conditions.createdAt[Op.gte] = startDate;
    if (endDate) conditions.createdAt[Op.lte] = endDate;
  }

  return conditions;
};

export const getContactMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = contactMessagesListQuerySchema.validate(req.query);
    if (error) throw ApiError.fromJoi(error);

    const { page, limit, sortBy, sortOrder, ...filters } = value;
    const whereConditions = buildWhereConditions(filters);
    const offset = (page - 1) * limit;
    const orderBy = [[sortBy === 'name' ? 'fullName' : sortBy, sortOrder.toUpperCase()]];

    const { count, rows } = await ContactMessage.findAndCountAll({
      where: whereConditions,
      order: orderBy,
      limit,
      offset,
      attributes: { exclude: ['ipAddress', 'userAgent'] }
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
    res.json(ApiSuccess.list(rows, paginationInfo, 'İletişim mesajları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getContactMessageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = contactMessageIdSchema.validate(req.params);
    if (error) throw ApiError.fromJoi(error);

    const message = await ContactMessage.findByPk(value.id);
    if (!message) throw ApiError.notFound('İletişim mesajı bulunamadı');

    if (!message.isRead) {
      await message.update({
        isRead: true
      });
    }

    res.json(ApiSuccess.item(message, 'İletişim mesajı başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

const STATUS_TRANSITIONS = {
  'new': ['read', 'replied', 'closed'],
  'read': ['replied', 'closed'],
  'replied': ['closed'],
  'closed': []
};

const getStatusUpdateData = (status: string, userId: string) => {
  const updateData: any = { status, updatedBy: userId };
  
  const statusActions = {
    'read': { readAt: new Date(), readBy: userId },
    'replied': { repliedAt: new Date(), repliedBy: userId },
    'closed': { closedAt: new Date(), closedBy: userId }
  };

  return { ...updateData, ...statusActions[status] };
};

export const updateContactMessageStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error: paramsError, value: paramsValue } = contactMessageIdSchema.validate(req.params);
    const { error: bodyError, value: bodyValue } = updateContactMessageStatusSchema.validate(req.body);
    if (paramsError || bodyError) throw ApiError.fromJoi(paramsError || bodyError);

    const message = await ContactMessage.findByPk(paramsValue.id);
    if (!message) throw ApiError.notFound('İletişim mesajı bulunamadı');

    const { status, adminNotes } = bodyValue;
    if (!STATUS_TRANSITIONS[message.status].includes(status)) {
      throw ApiError.badRequest(`${message.status} durumundan ${status} durumuna geçiş yapılamaz`);
    }

    const updateData = {
      ...getStatusUpdateData(status, req.user?.id),
      adminNotes
    };

    await message.update(updateData);
    res.json(new ApiSuccess(`Mesaj durumu "${status}" olarak güncellendi`, { message }));
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = contactMessageIdSchema.validate(req.params);
    if (error) throw ApiError.fromJoi(error);

    const message = await ContactMessage.findByPk(value.id);
    if (!message) throw ApiError.notFound('İletişim mesajı bulunamadı');

    await message.destroy();

    res.json(ApiSuccess.deleted('İletişim mesajı başarıyla silindi'));
  } catch (error) {
    next(error);
  }
};

export const getContactStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalMessages, unreadMessages, messagesThisMonth, dailyStats] = await Promise.all([
      ContactMessage.count(),
      ContactMessage.count({ where: { isRead: false } }),
      ContactMessage.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } }),
      ContactMessage.findAll({
        attributes: [[fn('DATE', col('createdAt')), 'date'], [fn('COUNT', col('id')), 'count']],
        where: { createdAt: { [Op.gte]: sevenDaysAgo } },
        group: [fn('DATE', col('createdAt'))],
        order: [[fn('DATE', col('createdAt')), 'ASC']],
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
    res.json(ApiSuccess.item(statsData, 'İletişim istatistikleri başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
}; 