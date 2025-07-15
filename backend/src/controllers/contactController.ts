import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col } from 'sequelize';

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
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      search,
      category,
      startDate,
      endDate
    } = req.query;
    
    const filters = { search, category, startDate, endDate };
    const whereConditions = buildWhereConditions(filters);
    const offset = (Number(page) - 1) * Number(limit);
    const orderBy = [[sortBy === 'name' ? 'fullName' : sortBy, String(sortOrder).toUpperCase()]];

    const { count, rows } = await ContactMessage.findAndCountAll({
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
    res.json(ApiSuccess.list(rows, paginationInfo, 'İletişim mesajları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getContactMessageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByPk(id);
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
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const message = await ContactMessage.findByPk(id);
    if (!message) throw ApiError.notFound('İletişim mesajı bulunamadı');

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
    const { id } = req.params;

    const message = await ContactMessage.findByPk(id);
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

export const createContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      throw ApiError.badRequest('Ad-soyad, e-posta, konu ve mesaj alanları zorunludur');
    }

    const clientInfo = {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    };

    const contactMessage = await ContactMessage.create({
      fullName,
      email,
      subject,
      message,
      ...clientInfo,
      status: 'new',
      isRead: false
    });

    res.status(201).json(ApiSuccess.created(
      contactMessage,
      'İletişim mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
    ));
  } catch (error) {
    next(error);
  }
}; 