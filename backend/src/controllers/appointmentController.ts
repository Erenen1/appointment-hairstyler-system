import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';
import { format, addMinutes } from 'date-fns';

import db from '../models/index';
const { Appointment, Customer, Service, Staff, AppointmentHistory, StaffService } = db;

export const getAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      startDate, 
      endDate, 
      staffId, 
      customerId, 
      serviceId, 
      sortBy = 'appointmentDate', 
      sortOrder = 'desc' 
    } = req.query;
    const whereConditions: any = {};
    if (startDate || endDate) {
      whereConditions.appointmentDate = {};
      if (startDate) whereConditions.appointmentDate[Op.gte] = startDate;
      if (endDate) whereConditions.appointmentDate[Op.lte] = endDate;
    }
    if (staffId) whereConditions.staffId = staffId;
    if (customerId) whereConditions.customerId = customerId;
    if (serviceId) whereConditions.serviceId = serviceId;
    const includeConditions: any = [
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
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      limit: Number(limit),
      offset,
      order: [[sortBy === 'customer_name' ? [{ model: Customer, as: 'customer' }, 'fullName'] : 
              sortBy === 'service_name' ? [{ model: Service, as: 'service' }, 'title'] : 
              sortBy, String(sortOrder).toUpperCase()]],
      distinct: true
    });
    const formattedAppointments = appointments.map((appointment: any) => ({
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
      appointmentDate: format(new Date(appointment.appointmentDate), 'yyyy-MM-dd'),
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      price: Number(appointment.price),
      notes: appointment.notes,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    }));
    const totalPages = Math.ceil(count / Number(limit));
    const paginationInfo = {
      currentPage: Number(page),
      totalPages,
      totalItems: count,
      itemsPerPage: Number(limit),
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1
    };
    res.json(ApiSuccess.list(formattedAppointments, paginationInfo, 'Randevu listesi başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customer: customerData, serviceId, staffId, appointmentDate, startTime, notes } = req.body;
    
    const service = await Service.findByPk(serviceId);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }
    const staff = await Staff.findByPk(staffId);
    if (!staff || !staff.isActive) {
      throw ApiError.notFound('Personel bulunamadı veya aktif değil');
    }

    // Personelin bu hizmeti verip veremeyeceğini kontrol et
    const staffService = await StaffService.findOne({
      where: {
        staffId: staffId,
        serviceId: serviceId,
        isActive: true
      }
    });
    if (!staffService) {
      throw ApiError.badRequest('Bu personel seçilen hizmeti veremiyor');
    }
    const appointmentDateStr = format(new Date(appointmentDate), 'yyyy-MM-dd');
    const startDateTime = new Date(`${appointmentDateStr}T${startTime}:00`);
    const endDateTime = addMinutes(startDateTime, service.duration);
    const endTime = format(endDateTime, 'HH:mm');
    const conflictingAppointment = await Appointment.findOne({
      where: {
        staffId: staffId,
        appointmentDate: appointmentDateStr,
        [Op.and]: [
          {
            [Op.or]: [
              {
                startTime: { [Op.lte]: startTime },
                endTime: { [Op.gt]: startTime }
              },
              {
                startTime: { [Op.lt]: endTime },
                endTime: { [Op.gte]: endTime }
              },
              {
                startTime: { [Op.gte]: startTime },
                endTime: { [Op.lte]: endTime }
              }
            ]
          }
        ]
      }
    });
    if (conflictingAppointment) {
      throw ApiError.conflict('Bu saatte başka bir randevu mevcut');
    }
    let customer = await Customer.findOne({
      where: {
        [Op.or]: [
          { email: customerData.email },
          { phone: customerData.phone }
        ]
      }
    });
    if (!customer) {
      customer = await Customer.create({
        fullName: customerData.fullName,
        email: customerData.email,
        phone: customerData.phone,
      });
    }
    const appointment = await Appointment.create({
      customerId: customer.id,
      staffId: staffId,
      serviceId: serviceId,
      appointmentDate: appointmentDateStr,
      startTime: startTime,
      endTime: endTime,
      price: service.price,
      notes: notes || '',
      createdByAdmin: req.user?.userType === 'admin' ? req.user.id : null
    });
    await AppointmentHistory.create({
      appointmentId: appointment.id,
      notes: 'Randevu oluşturuldu',
      createdByAdmin: req.user?.userType === 'admin' ? req.user.id : null
    });
    res.status(201).json(ApiSuccess.created(appointment, 'Randevu başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
};

export const getCalendarAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      throw ApiError.badRequest('Başlangıç ve bitiş tarihi gereklidir');
    }
    
    const appointments = await Appointment.findAll({
      where: {
        appointmentDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'title', 'duration']
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'fullName']
        }
      ],
      order: [
        ['appointmentDate', 'ASC'],
        ['startTime', 'ASC']
      ]
    });
    
    const calendarEvents = appointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.customer.fullName} - ${appointment.service.title}`,
      start: `${appointment.appointmentDate}T${appointment.startTime}`,
      end: `${appointment.appointmentDate}T${appointment.endTime}`,
      resourceId: appointment.staffId,
      extendedProps: {
        customer: appointment.customer,
        service: appointment.service,
        staff: appointment.staff,
        notes: appointment.notes
      }
    }));
    
    res.json(ApiSuccess.list(calendarEvents, null, 'Takvim randevuları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByPk(id, {
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
        },
        {
          model: AppointmentHistory,
          as: 'history',
          attributes: ['id', 'notes', 'createdAt'],
          include: [
            {
              model: db.Admin,
              as: 'createdBy',
              attributes: ['id', 'fullName']
            }
          ]
        }
      ]
    });
    
    if (!appointment) {
      throw ApiError.notFound('Randevu bulunamadı');
    }
    
    res.json(ApiSuccess.item(appointment, 'Randevu detayları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
}; 