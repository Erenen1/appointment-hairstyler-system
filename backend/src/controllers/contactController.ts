import { Request, Response } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col } from 'sequelize';
import { 
  contactMessagesListQuerySchema,
  contactMessageIdSchema,
  updateContactMessageStatusSchema
} from '../validations/contactValidation';
const db = require('../models');
const { ContactMessage } = db;
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
export const getContactMessages = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = contactMessagesListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { page, limit, search, category, status, sortBy, sortOrder, startDate, endDate } = value;
    const whereConditions: any = {};
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
        { message: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category) {
      whereConditions.category = category;
    }
    if (status) {
      whereConditions.status = status;
    }
    if (startDate && endDate) {
      whereConditions.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereConditions.createdAt = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereConditions.createdAt = {
        [Op.lte]: endDate
      };
    }
    const offset = (page - 1) * limit;
    const orderBy: any[] = [];
    if (sortBy === 'name') {
      orderBy.push(['name', sortOrder.toUpperCase()]);
    } else {
      orderBy.push([sortBy, sortOrder.toUpperCase()]);
    }
    const { count, rows } = await ContactMessage.findAndCountAll({
      where: whereConditions,
      order: orderBy,
      limit,
      offset,
      attributes: {
        exclude: ['ipAddress', 'userAgent'] 
      }
    });
    const totalPages = Math.ceil(count / limit);
    const stats = await ContactMessage.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });
    const statusStats = stats.reduce((acc: any, stat: any) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {});
    res.json(new ApiSuccess('İletişim mesajları başarıyla getirildi', {
      messages: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        total: count,
        new: statusStats.new || 0,
        read: statusStats.read || 0,
        replied: statusStats.replied || 0,
        closed: statusStats.closed || 0
      }
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('İletişim mesajları getirilirken hata oluştu');
  }
};
export const getContactMessageById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = contactMessageIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { id } = value;
    const message = await ContactMessage.findByPk(id);
    if (!message) {
      throw ApiError.notFound('İletişim mesajı bulunamadı');
    }
    if (message.status === 'new') {
      await message.update({
        status: 'read',
        readAt: new Date(),
        readBy: req.user?.id
      });
    }
    res.json(new ApiSuccess('İletişim mesajı başarıyla getirildi', { message }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('İletişim mesajı getirilirken hata oluştu');
  }
};
export const updateContactMessageStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error: paramsError, value: paramsValue } = contactMessageIdSchema.validate(req.params);
    if (paramsError) {
      throw ApiError.fromJoi(paramsError);
    }
    const { error: bodyError, value: bodyValue } = updateContactMessageStatusSchema.validate(req.body);
    if (bodyError) {
      throw ApiError.fromJoi(bodyError);
    }
    const { id } = paramsValue;
    const { status, adminNotes } = bodyValue;
    const message = await ContactMessage.findByPk(id);
    if (!message) {
      throw ApiError.notFound('İletişim mesajı bulunamadı');
    }
    const validTransitions: { [key: string]: string[] } = {
      'new': ['read', 'replied', 'closed'],
      'read': ['replied', 'closed'],
      'replied': ['closed'],
      'closed': [] 
    };
    if (!validTransitions[message.status].includes(status)) {
      throw ApiError.badRequest(`${message.status} durumundan ${status} durumuna geçiş yapılamaz`);
    }
    const updateData: any = {
      status,
      adminNotes,
      updatedBy: req.user?.id
    };
    if (status === 'read' && message.status === 'new') {
      updateData.readAt = new Date();
      updateData.readBy = req.user?.id;
    }
    if (status === 'replied') {
      updateData.repliedAt = new Date();
      updateData.repliedBy = req.user?.id;
    }
    if (status === 'closed') {
      updateData.closedAt = new Date();
      updateData.closedBy = req.user?.id;
    }
    await message.update(updateData);
    res.json(new ApiSuccess(`Mesaj durumu "${status}" olarak güncellendi`, { message }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Mesaj durumu güncellenirken hata oluştu');
  }
};
export const deleteContactMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = contactMessageIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { id } = value;
    const message = await ContactMessage.findByPk(id);
    if (!message) {
      throw ApiError.notFound('İletişim mesajı bulunamadı');
    }
    await message.update({
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: req.user?.id
    });
    res.json(new ApiSuccess('İletişim mesajı başarıyla silindi'));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('İletişim mesajı silinirken hata oluştu');
  }
};
export const getContactStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const totalMessages = await ContactMessage.count({
      where: { isDeleted: { [Op.ne]: true } }
    });
    const newMessages = await ContactMessage.count({
      where: { 
        status: 'new',
        isDeleted: { [Op.ne]: true }
      }
    });
    const messagesThisMonth = await ContactMessage.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo },
        isDeleted: { [Op.ne]: true }
      }
    });
    const categoryStats = await ContactMessage.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { isDeleted: { [Op.ne]: true } },
      group: ['category'],
      raw: true
    });
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyStats = await ContactMessage.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
        isDeleted: { [Op.ne]: true }
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true
    });
    res.json(new ApiSuccess('İletişim istatistikleri başarıyla getirildi', {
      summary: {
        totalMessages,
        newMessages,
        messagesThisMonth,
        responseRate: totalMessages > 0 ? 
          Math.round(((totalMessages - newMessages) / totalMessages) * 100) : 0
      },
      categoryDistribution: categoryStats.map((stat: any) => ({
        category: stat.category,
        count: parseInt(stat.count),
        percentage: totalMessages > 0 ? 
          Math.round((parseInt(stat.count) / totalMessages) * 100) : 0
      })),
      dailyActivity: dailyStats.map((stat: any) => ({
        date: stat.date,
        count: parseInt(stat.count)
      }))
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('İletişim istatistikleri getirilirken hata oluştu');
  }
}; 