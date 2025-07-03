import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col, literal } from 'sequelize';
import { format, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from 'date-fns';

import db from '../models/index';
const { Appointment, Customer, Service, Staff } = db;

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfCurrentMonth = startOfMonth(today);
    const endOfCurrentMonth = endOfMonth(today);
    const startOfLastMonth = startOfMonth(subMonths(today, 1));
    const endOfLastMonth = endOfMonth(subMonths(today, 1));
    const todaysAppointments = await Appointment.findAll({
      where: {
        appointmentDate: {
          [Op.between]: [startOfToday, endOfToday]
        }
      }
    });
    const todaysStats = {
      total: todaysAppointments.length
    };
    const totalCustomers = await Customer.count();
    const newCustomersThisMonth = await Customer.count({
      where: {
        createdAt: {
          [Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
        }
      }
    });
    const threeMonthsAgo = subMonths(today, 3);
    const activeCustomers = await Customer.count({
      include: [{
        model: Appointment,
        as: 'appointments',
        where: {
          appointmentDate: {
            [Op.gte]: threeMonthsAgo
          }
        },
        required: true
      }]
    });
    const currentMonthRevenue = await Appointment.sum('price', {
      where: {
        appointmentDate: {
          [Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
        }
      }
    }) || 0;
    const lastMonthRevenue = await Appointment.sum('price', {
      where: {
        appointmentDate: {
          [Op.between]: [startOfLastMonth, endOfLastMonth]
        }
      }
    }) || 0;
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;
    const totalCompletedAppointments = await Appointment.count();
    const thisMonthCompleted = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
        }
      }
    });
    const lastMonthCompleted = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.between]: [startOfLastMonth, endOfLastMonth]
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
    res.json(ApiSuccess.item(dashboardStats, 'Dashboard istatistikleri başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getRevenueChart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { months = 6 } = req.query;
    const monthCount = parseInt(months as string) || 6;
    const endDate = endOfMonth(new Date());
    const startDate = startOfMonth(subMonths(new Date(), monthCount - 1));
    const revenueData = await Appointment.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('appointmentDate')), 'month'],
        [fn('SUM', col('price')), 'revenue']
      ],
      where: {
        appointmentDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [fn('DATE_TRUNC', 'month', col('appointmentDate'))],
      order: [[fn('DATE_TRUNC', 'month', col('appointmentDate')), 'ASC']],
      raw: true
    });
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const chartData = {
      labels: revenueData.map((item: any) => {
        const date = new Date(item.month);
        return monthNames[date.getMonth()];
      }),
      datasets: [{
        label: 'Aylık Gelir (₺)',
        data: revenueData.map((item: any) => Number(item.revenue) || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        fill: true
      }]
    };
    res.json(ApiSuccess.item(chartData, 'Gelir grafiği verileri başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getPopularServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 5 } = req.query;
    const limitCount = parseInt(limit as string) || 5;
    const popularServices = await Service.findAll({
      attributes: [
        'id',
        'title',
        'price',
        [fn('COUNT', col('appointments.id')), 'appointmentCount']
      ],
      include: [{
        model: Appointment,
        as: 'appointments',
        attributes: [],
        required: false
      }],
      group: ['Service.id'],
      order: [[fn('COUNT', col('appointments.id')), 'DESC']],
      limit: limitCount,
      raw: true
    });
    res.json(ApiSuccess.list(popularServices, null, 'Popüler hizmetler başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getRecentAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit = 10 } = req.query;
    const limitCount = parseInt(limit as string) || 10;
    const recentAppointments = await Appointment.findAll({
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
    const formattedAppointments = recentAppointments.map((appointment: any) => ({
      id: appointment.id,
      customer: appointment.customer.fullName,
      service: appointment.service.title,
      staff: appointment.staff.fullName,
      date: format(new Date(appointment.appointmentDate), 'dd/MM/yyyy'),
      time: appointment.startTime,
      price: Number(appointment.price),
      createdAt: appointment.createdAt
    }));
    res.json(ApiSuccess.list(formattedAppointments, null, 'Son randevular başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
}; 