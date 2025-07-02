import { Request, Response } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col, literal } from 'sequelize';
import { format, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from 'date-fns';
const db = require('../models');
const { Appointment, Customer, Service, Staff, AppointmentStatus } = db;
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
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
        appointment_date: {
          [Op.between]: [startOfToday, endOfToday]
        }
      },
      include: [{
        model: AppointmentStatus,
        as: 'status'
      }]
    });
    const todaysStats = {
      total: todaysAppointments.length,
      completed: todaysAppointments.filter((apt: any) => apt.status?.name === 'completed').length,
      pending: todaysAppointments.filter((apt: any) => apt.status?.name === 'pending').length,
      cancelled: todaysAppointments.filter((apt: any) => apt.status?.name === 'cancelled').length
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
          appointment_date: {
            [Op.gte]: threeMonthsAgo
          }
        },
        required: true
      }]
    });
    const currentMonthRevenue = await Appointment.sum('total_price', {
      where: {
        appointment_date: {
          [Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
        },
        '$status.name$': 'completed'
      },
      include: [{
        model: AppointmentStatus,
        as: 'status'
      }]
    }) || 0;
    const lastMonthRevenue = await Appointment.sum('total_price', {
      where: {
        appointment_date: {
          [Op.between]: [startOfLastMonth, endOfLastMonth]
        },
        '$status.name$': 'completed'
      },
      include: [{
        model: AppointmentStatus,
        as: 'status'
      }]
    }) || 0;
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;
    const totalCompletedAppointments = await Appointment.count({
      include: [{
        model: AppointmentStatus,
        as: 'status',
        where: { name: 'completed' }
      }]
    });
    const thisMonthCompleted = await Appointment.count({
      where: {
        appointment_date: {
          [Op.between]: [startOfCurrentMonth, endOfCurrentMonth]
        }
      },
      include: [{
        model: AppointmentStatus,
        as: 'status',
        where: { name: 'completed' }
      }]
    });
    const lastMonthCompleted = await Appointment.count({
      where: {
        appointment_date: {
          [Op.between]: [startOfLastMonth, endOfLastMonth]
        }
      },
      include: [{
        model: AppointmentStatus,
        as: 'status',
        where: { name: 'completed' }
      }]
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
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
};
export const getRevenueChart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { months = 6 } = req.query;
    const monthCount = parseInt(months as string) || 6;
    const endDate = endOfMonth(new Date());
    const startDate = startOfMonth(subMonths(new Date(), monthCount - 1));
    const revenueData = await Appointment.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('appointment_date')), 'month'],
        [fn('SUM', col('total_price')), 'revenue']
      ],
      where: {
        appointment_date: {
          [Op.between]: [startDate, endDate]
        },
        '$status.name$': 'completed'
      },
      include: [{
        model: AppointmentStatus,
        as: 'status',
        attributes: []
      }],
      group: [fn('DATE_TRUNC', 'month', col('appointment_date'))],
      order: [[fn('DATE_TRUNC', 'month', col('appointment_date')), 'ASC']],
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
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
};
export const getPopularServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 5 } = req.query;
    const limitCount = parseInt(limit as string) || 5;
    const popularServices = await Service.findAll({
      attributes: [
        'id',
        'name',
        [fn('COUNT', col('appointments.id')), 'appointmentCount'],
        [fn('SUM', col('appointments.total_price')), 'revenue']
      ],
      include: [{
        model: Appointment,
        as: 'appointments',
        attributes: [],
        include: [{
          model: AppointmentStatus,
          as: 'status',
          where: { name: 'completed' },
          attributes: []
        }]
      }],
      group: ['Service.id'],
      order: [[fn('COUNT', col('appointments.id')), 'DESC']],
      limit: limitCount,
      raw: true,
      having: literal('COUNT("appointments"."id") > 0')
    });
    const totalAppointments = popularServices.reduce((sum: number, service: any) => 
      sum + parseInt(service.appointmentCount), 0
    );
    const servicesWithPercentage = popularServices.map((service: any) => ({
      id: service.id,
      name: service.name,
      appointmentCount: parseInt(service.appointmentCount),
      revenue: Number(service.revenue) || 0,
      percentage: totalAppointments > 0 
        ? Math.round((parseInt(service.appointmentCount) / totalAppointments) * 100)
        : 0
    }));
    res.json(ApiSuccess.item(servicesWithPercentage, 'Popüler hizmetler başarıyla getirildi'));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
};
export const getRecentAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10 } = req.query;
    const limitCount = parseInt(limit as string) || 10;
    const recentAppointments = await Appointment.findAll({
      limit: limitCount,
      order: [['createdAt', 'DESC']],
      include: [
                  {
            model: Customer,
            as: 'customer',
            attributes: ['firstName', 'lastName']
          },
          {
            model: Service,
            as: 'service',
            attributes: ['name']
          },
          {
            model: Staff,
            as: 'staff',
            attributes: ['firstName', 'lastName']
          },
        {
          model: AppointmentStatus,
          as: 'status',
          attributes: ['name', 'display_name']
        }
      ]
    });
    const formattedAppointments = recentAppointments.map((appointment: any) => ({
      id: appointment.id,
              customerName: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
        serviceName: appointment.service.name,
        staffName: `${appointment.staff.firstName} ${appointment.staff.lastName}`,
              appointmentDate: format(new Date(appointment.appointmentDate), 'dd.MM.yyyy'),
        startTime: appointment.startTime,
      status: appointment.status.display_name || appointment.status.name,
      price: Number(appointment.total_price)
    }));
    res.json(ApiSuccess.item(formattedAppointments, 'Son randevular başarıyla getirildi'));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
}; 