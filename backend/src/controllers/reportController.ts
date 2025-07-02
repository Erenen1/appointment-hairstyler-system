import { Request, Response } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col, literal } from 'sequelize';
import { 
  revenueReportQuerySchema,
  appointmentReportQuerySchema,
  customerReportQuerySchema,
  popularServicesReportQuerySchema,
  staffPerformanceReportQuerySchema
} from '../validations/reportValidation';

const db = require('../models');
const { Appointment, Customer, Staff, Service, ServiceCategory } = db;

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * Gelir raporu
 * GET /api/v1/reports/revenue
 */
export const getRevenueReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Query parametrelerini validate et
    const { error, value } = revenueReportQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { startDate, endDate, groupBy, staffId, serviceId } = value;

    // Filtreleme koşulları
    const whereConditions: any = {
      appointmentDate: {
        [Op.between]: [startDate, endDate]
      },
      status: 'completed'
    };

    if (staffId) {
      whereConditions.staffId = staffId;
    }

    if (serviceId) {
      whereConditions.serviceId = serviceId;
    }

    // Gruplama formatı belirleme
    let dateFormat: string;
    switch (groupBy) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-%u';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    // Gelir verilerini getir
    const revenueData = await Appointment.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('appointmentDate'), dateFormat), 'period'],
        [fn('SUM', col('totalPrice')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'appointmentCount'],
        [fn('AVG', col('totalPrice')), 'averageTicket']
      ],
      where: whereConditions,
      group: [fn('DATE_FORMAT', col('appointmentDate'), dateFormat)],
      order: [[fn('DATE_FORMAT', col('appointmentDate'), dateFormat), 'ASC']],
      raw: true
    });

    // Toplam özet bilgileri
    const totalStats = await Appointment.findOne({
      attributes: [
        [fn('SUM', col('totalPrice')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'totalAppointments'],
        [fn('AVG', col('totalPrice')), 'averageTicket']
      ],
      where: whereConditions,
      raw: true
    });

    // En çok gelir getiren hizmetler
    const topServices = await Appointment.findAll({
      attributes: [
        [fn('SUM', col('totalPrice')), 'revenue'],
        [fn('COUNT', col('Appointment.id')), 'count']
      ],
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['name']
        }
      ],
      where: whereConditions,
      group: ['serviceId', 'service.name'],
      order: [[fn('SUM', col('totalPrice')), 'DESC']],
      limit: 10
    });

    res.json(new ApiSuccess('Gelir raporu başarıyla getirildi', {
      summary: {
        totalRevenue: parseFloat(totalStats.totalRevenue) || 0,
        totalAppointments: parseInt(totalStats.totalAppointments) || 0,
        averageTicket: parseFloat(totalStats.averageTicket) || 0
      },
      chartData: revenueData.map((item: any) => ({
        period: item.period,
        totalRevenue: parseFloat(item.totalRevenue) || 0,
        appointmentCount: parseInt(item.appointmentCount) || 0,
        averageTicket: parseFloat(item.averageTicket) || 0
      })),
      topServices: topServices.map((item: any) => ({
        serviceName: item.service.name,
        revenue: parseFloat(item.revenue) || 0,
        count: parseInt(item.count) || 0
      }))
    }));

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Gelir raporu getirilirken hata oluştu');
  }
};

/**
 * Randevu raporu
 * GET /api/v1/reports/appointments
 */
export const getAppointmentReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Query parametrelerini validate et
    const { error, value } = appointmentReportQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { startDate, endDate, staffId, serviceId, status } = value;

    // Filtreleme koşulları
    const whereConditions: any = {
      appointmentDate: {
        [Op.between]: [startDate, endDate]
      }
    };

    if (staffId) whereConditions.staffId = staffId;
    if (serviceId) whereConditions.serviceId = serviceId;
    if (status) whereConditions.status = status;

    // Genel istatistikler
    const totalAppointments = await Appointment.count({
      where: whereConditions
    });

    const completedAppointments = await Appointment.count({
      where: { ...whereConditions, status: 'completed' }
    });

    const cancelledAppointments = await Appointment.count({
      where: { ...whereConditions, status: 'cancelled' }
    });

    const completionRate = totalAppointments > 0 ? 
      ((completedAppointments / totalAppointments) * 100) : 0;

    // Yoğun saatler analizi
    const busyHours = await Appointment.findAll({
      attributes: [
        [fn('HOUR', col('startTime')), 'hour'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: whereConditions,
      group: [fn('HOUR', col('startTime'))],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true
    });

    // Yoğun günler analizi
    const busyDays = await Appointment.findAll({
      attributes: [
        [fn('DAYNAME', col('appointmentDate')), 'day'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: whereConditions,
      group: [fn('DAYNAME', col('appointmentDate'))],
      order: [[fn('COUNT', col('id')), 'DESC']],
      raw: true
    });

    // Durum dağılımı
    const statusDistribution = await Appointment.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      where: whereConditions,
      group: ['status'],
      raw: true
    });

    res.json(new ApiSuccess('Randevu raporu başarıyla getirildi', {
      summary: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        completionRate: Math.round(completionRate * 100) / 100
      },
      busyHours: busyHours.map((item: any) => ({
        hour: `${item.hour}:00`,
        count: parseInt(item.count)
      })),
      busyDays: busyDays.map((item: any) => ({
        day: item.day,
        count: parseInt(item.count)
      })),
      statusDistribution: statusDistribution.map((item: any) => ({
        status: item.status,
        count: parseInt(item.count),
        percentage: Math.round((parseInt(item.count) / totalAppointments) * 100)
      }))
    }));

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Randevu raporu getirilirken hata oluştu');
  }
};

/**
 * Müşteri raporu
 * GET /api/v1/reports/customers
 */
export const getCustomerReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Query parametrelerini validate et
    const { error, value } = customerReportQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { startDate, endDate, groupBy, includeInactive } = value;

    // Müşteri filtreleme
    const customerWhere: any = {};
    if (!includeInactive) {
      customerWhere.isActive = true;
    }

    // Toplam müşteri sayısı
    const totalCustomers = await Customer.count({
      where: customerWhere
    });

    // Yeni müşteriler (belirtilen tarih aralığında)
    const newCustomers = await Customer.count({
      where: {
        ...customerWhere,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    // Dönen müşteriler (birden fazla randevusu olan)
    const returningCustomers = await Customer.count({
      where: customerWhere,
      include: [
        {
          model: Appointment,
          as: 'appointments',
          where: {
            status: 'completed'
          },
          having: literal('COUNT(appointments.id) > 1')
        }
      ],
      group: ['Customer.id'],
      distinct: true
    });

    // En çok harcama yapan müşteriler
    const topCustomers = await Customer.findAll({
      attributes: [
        'firstName',
        'lastName',
        [fn('COUNT', col('appointments.id')), 'visitCount'],
        [fn('SUM', col('appointments.totalPrice')), 'totalSpent']
      ],
      include: [
        {
          model: Appointment,
          as: 'appointments',
          attributes: [],
          where: {
            status: 'completed',
            appointmentDate: {
              [Op.between]: [startDate, endDate]
            }
          }
        }
      ],
      where: customerWhere,
      group: ['Customer.id', 'Customer.firstName', 'Customer.lastName'],
      order: [[fn('SUM', col('appointments.totalPrice')), 'DESC']],
      limit: 10,
      having: literal('COUNT(appointments.id) > 0')
    });

    // Müşteri büyümesi (aylık)
    let dateFormat: string;
    switch (groupBy) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-%u';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m';
    }

    const customerGrowth = await Customer.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), dateFormat), 'period'],
        [fn('COUNT', col('id')), 'newCustomers']
      ],
      where: {
        ...customerWhere,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [fn('DATE_FORMAT', col('createdAt'), dateFormat)],
      order: [[fn('DATE_FORMAT', col('createdAt'), dateFormat), 'ASC']],
      raw: true
    });

    res.json(new ApiSuccess('Müşteri raporu başarıyla getirildi', {
      summary: {
        totalCustomers,
        newCustomers,
        returningCustomers: returningCustomers.length || 0,
        retentionRate: totalCustomers > 0 ? 
          Math.round(((returningCustomers.length || 0) / totalCustomers) * 100) : 0
      },
      topCustomers: topCustomers.map((customer: any) => ({
        customerName: `${customer.firstName} ${customer.lastName}`,
        totalSpent: parseFloat(customer.getDataValue('totalSpent')) || 0,
        visitCount: parseInt(customer.getDataValue('visitCount')) || 0
      })),
      customerGrowth: customerGrowth.map((item: any) => ({
        period: item.period,
        newCustomers: parseInt(item.newCustomers) || 0
      }))
    }));

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Müşteri raporu getirilirken hata oluştu');
  }
};

/**
 * Popüler hizmetler raporu
 * GET /api/v1/reports/popular-services
 */
export const getPopularServicesReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Query parametrelerini validate et
    const { error, value } = popularServicesReportQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { startDate, endDate, limit, categoryId } = value;

    // Filtreleme koşulları
    const whereConditions: any = {
      appointmentDate: {
        [Op.between]: [startDate, endDate]
      },
      status: 'completed'
    };

    // Hizmet filtreleme
    const serviceInclude: any = {
      model: Service,
      as: 'service',
      attributes: ['name', 'price', 'duration']
    };

    if (categoryId) {
      serviceInclude.where = { categoryId };
      serviceInclude.include = [
        {
          model: ServiceCategory,
          as: 'category',
          attributes: ['name']
        }
      ];
    }

    // Popüler hizmetler
    const popularServices = await Appointment.findAll({
      attributes: [
        [fn('COUNT', col('Appointment.id')), 'appointmentCount'],
        [fn('SUM', col('totalPrice')), 'totalRevenue'],
        [fn('AVG', col('totalPrice')), 'averagePrice']
      ],
      include: [serviceInclude],
      where: whereConditions,
      group: ['serviceId', 'service.name', 'service.price', 'service.duration'],
      order: [[fn('COUNT', col('Appointment.id')), 'DESC']],
      limit
    });

    // Toplam randevu sayısı (yüzde hesabı için)
    const totalAppointments = await Appointment.count({
      where: whereConditions
    });

    res.json(new ApiSuccess('Popüler hizmetler raporu başarıyla getirildi', {
      services: popularServices.map((item: any) => {
        const appointmentCount = parseInt(item.getDataValue('appointmentCount'));
        const totalRevenue = parseFloat(item.getDataValue('totalRevenue'));
        
        return {
          serviceName: item.service.name,
          appointmentCount,
          totalRevenue,
          averagePrice: parseFloat(item.getDataValue('averagePrice')) || 0,
          percentage: totalAppointments > 0 ? 
            Math.round((appointmentCount / totalAppointments) * 100) : 0,
          duration: item.service.duration,
          basePrice: item.service.price
        };
      }),
      summary: {
        totalAppointments,
        totalServices: popularServices.length
      }
    }));

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Popüler hizmetler raporu getirilirken hata oluştu');
  }
};

/**
 * Personel performans raporu
 * GET /api/v1/reports/staff-performance
 */
export const getStaffPerformanceReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Query parametrelerini validate et
    const { error, value } = staffPerformanceReportQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { startDate, endDate, staffId, includeInactive } = value;

    // Personel filtreleme
    const staffWhere: any = {};
    if (!includeInactive) {
      staffWhere.isActive = true;
    }
    if (staffId) {
      staffWhere.id = staffId;
    }

    // Randevu filtreleme
    const appointmentWhere: any = {
      appointmentDate: {
        [Op.between]: [startDate, endDate]
      },
      status: 'completed'
    };

    // Personel performans verileri
    const staffPerformance = await Staff.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        [fn('COUNT', col('appointments.id')), 'totalAppointments'],
        [fn('SUM', col('appointments.totalPrice')), 'totalRevenue'],
        [fn('AVG', col('appointments.totalPrice')), 'averageTicket'],
        [fn('COUNT', fn('DISTINCT', col('appointments.customerId'))), 'uniqueCustomers']
      ],
      include: [
        {
          model: Appointment,
          as: 'appointments',
          attributes: [],
          where: appointmentWhere
        }
      ],
      where: staffWhere,
      group: ['Staff.id', 'Staff.firstName', 'Staff.lastName'],
      order: [[fn('SUM', col('appointments.totalPrice')), 'DESC']],
      having: literal('COUNT(appointments.id) > 0')
    });

    // Genel istatistikler
    const totalRevenue = staffPerformance.reduce((sum: number, staff: any) => 
      sum + (parseFloat(staff.getDataValue('totalRevenue')) || 0), 0);
    
    const totalAppointments = staffPerformance.reduce((sum: number, staff: any) => 
      sum + (parseInt(staff.getDataValue('totalAppointments')) || 0), 0);

    res.json(new ApiSuccess('Personel performans raporu başarıyla getirildi', {
      summary: {
        totalStaff: staffPerformance.length,
        totalRevenue,
        totalAppointments,
        averageRevenuePerStaff: staffPerformance.length > 0 ? 
          Math.round(totalRevenue / staffPerformance.length) : 0
      },
      staffPerformance: staffPerformance.map((staff: any) => {
        const revenue = parseFloat(staff.getDataValue('totalRevenue')) || 0;
        const appointments = parseInt(staff.getDataValue('totalAppointments')) || 0;
        
        return {
          staffId: staff.id,
          staffName: `${staff.firstName} ${staff.lastName}`,
          totalAppointments: appointments,
          totalRevenue: revenue,
          averageTicket: parseFloat(staff.getDataValue('averageTicket')) || 0,
          uniqueCustomers: parseInt(staff.getDataValue('uniqueCustomers')) || 0,
          revenuePercentage: totalRevenue > 0 ? 
            Math.round((revenue / totalRevenue) * 100) : 0,
          appointmentPercentage: totalAppointments > 0 ? 
            Math.round((appointments / totalAppointments) * 100) : 0
        };
      })
    }));

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Personel performans raporu getirilirken hata oluştu');
  }
}; 