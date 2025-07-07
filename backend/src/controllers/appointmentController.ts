import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';
import { format, addMinutes } from 'date-fns';
import { 
  createAppointmentSchema, 
  appointmentListQuerySchema, 
  appointmentIdSchema,
  calendarQuerySchema
} from '../validations/appointmentValidation';

import db from '../models/index';
const { Appointment, Customer, Service, Staff, AppointmentHistory, StaffService } = db;

export const getAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = appointmentListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { 
      page, 
      limit, 
      startDate, 
      endDate, 
      staffId, 
      customerId, 
      serviceId, 
      sortBy, 
      sortOrder 
    } = value;
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
    const offset = (page - 1) * limit;
    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      limit,
      offset,
      order: [[sortBy === 'customer_name' ? [{ model: Customer, as: 'customer' }, 'fullName'] : 
              sortBy === 'service_name' ? [{ model: Service, as: 'service' }, 'title'] : 
              sortBy, sortOrder.toUpperCase()]],
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
    const totalPages = Math.ceil(count / limit);
    const paginationInfo = {
      currentPage: page,
      totalPages,
      totalItems: count,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
    res.json(ApiSuccess.list(formattedAppointments, paginationInfo, 'Randevu listesi başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = createAppointmentSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { customer: customerData, serviceId, staffId, appointmentDate, startTime, notes } = value;
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
        notes: customerData.notes
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
    const fullAppointment = await Appointment.findByPk(appointment.id, {
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
        }
      ]
    });
    res.status(201).json(ApiSuccess.created(fullAppointment, 'Randevu başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
};

export const getCalendarAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = calendarQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { startDate, endDate, staffId } = value;
    const whereConditions: any = {
      appointmentDate: {
        [Op.between]: [startDate, endDate]
      }
    };
    if (staffId) {
      whereConditions.staffId = staffId;
    }
    const appointments = await Appointment.findAll({
      where: whereConditions,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['fullName', 'phone']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['title']
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['fullName']
        }
      ],
      order: [['appointmentDate', 'ASC'], ['startTime', 'ASC']]
    });
    const calendarEvents = appointments.map((appointment: any) => {
      const startDateTime = `${appointment.appointmentDate}T${appointment.startTime}:00`;
      const endDateTime = `${appointment.appointmentDate}T${appointment.endTime}:00`;
      return {
        id: appointment.id,
        title: `${appointment.customer.fullName} - ${appointment.service.title}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: '#28a745',
        borderColor: '#28a745',
        extendedProps: {
          customerName: appointment.customer.fullName,
          serviceName: appointment.service.title,
          staffName: appointment.staff.fullName,
          phone: appointment.customer.phone,
          price: Number(appointment.price),
          notes: appointment.notes
        }
      };
    });
    res.json(ApiSuccess.item(calendarEvents, 'Takvim randevuları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = appointmentIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const appointment = await Appointment.findByPk(value.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'title', 'price', 'duration', 'description']
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'fullName', 'specialties', 'phone']
        },
        {
          model: AppointmentHistory,
          as: 'history',
          order: [['createdAt', 'DESC']]
        }
      ]
    });
    if (!appointment) {
      throw ApiError.notFound('Randevu bulunamadı');
    }
    res.json(ApiSuccess.item(appointment, 'Randevu detayı başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
}; 