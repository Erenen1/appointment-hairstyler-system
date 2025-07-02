import { Request, Response } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col, literal } from 'sequelize';
import { format, addMinutes, parse } from 'date-fns';
import { 
  createAppointmentSchema, 
  appointmentListQuerySchema, 
  updateAppointmentStatusSchema,
  appointmentIdSchema,
  calendarQuerySchema
} from '../validations/appointmentValidation';

const db = require('../models');
const { Appointment, Customer, Service, Staff, AppointmentStatus, AppointmentHistory } = db;

// User session tipini genişletme
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    userType: 'admin' | 'staff';
  };
}

/**
 * Randevu listesi
 */
export const getAppointments = async (req: Request, res: Response): Promise<void> => {
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
      status, 
      sortBy, 
      sortOrder 
    } = value;

    const whereConditions: any = {};

    // Tarih filtreleri
    if (startDate || endDate) {
      whereConditions.appointmentDate = {};
      if (startDate) whereConditions.appointmentDate[Op.gte] = startDate;
      if (endDate) whereConditions.appointmentDate[Op.lte] = endDate;
    }

    // Diğer filtreler
    if (staffId) whereConditions.staffId = staffId;
    if (customerId) whereConditions.customerId = customerId;
    if (serviceId) whereConditions.serviceId = serviceId;

    // Status filtresi
    const includeConditions: any = [
      {
        model: Customer,
        as: 'customer',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
      },
      {
        model: Service,
        as: 'service',
        attributes: ['id', 'name', 'price', 'duration']
      },
      {
        model: Staff,
        as: 'staff',
        attributes: ['id', 'firstName', 'lastName', 'specialties']
      },
      {
        model: AppointmentStatus,
        as: 'status',
        attributes: ['id', 'name', 'displayName'],
        ...(status && { where: { name: status } })
      }
    ];

    const offset = (page - 1) * limit;
    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      limit,
      offset,
      order: [[sortBy === 'customer_name' ? [{ model: Customer, as: 'customer' }, 'firstName'] : 
              sortBy === 'service_name' ? [{ model: Service, as: 'service' }, 'name'] : 
              sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    // Response formatı
    const formattedAppointments = appointments.map((appointment: any) => ({
      id: appointment.id,
      customerId: appointment.customerId,
      customer: {
        id: appointment.customer.id,
        firstName: appointment.customer.firstName,
        lastName: appointment.customer.lastName,
        email: appointment.customer.email,
        phone: appointment.customer.phone,
        fullName: `${appointment.customer.firstName} ${appointment.customer.lastName}`
      },
      staffId: appointment.staffId,
      staff: {
        id: appointment.staff.id,
        firstName: appointment.staff.firstName,
        lastName: appointment.staff.lastName,
        specialties: appointment.staff.specialties,
        fullName: `${appointment.staff.firstName} ${appointment.staff.lastName}`
      },
      serviceId: appointment.serviceId,
      service: {
        id: appointment.service.id,
        name: appointment.service.name,
        price: Number(appointment.service.price),
        duration: appointment.service.duration
      },
      appointmentDate: format(new Date(appointment.appointmentDate), 'yyyy-MM-dd'),
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: {
        id: appointment.status.id,
        name: appointment.status.name,
        displayName: appointment.status.displayName
      },
      price: Number(appointment.price),
      discountAmount: Number(appointment.discountAmount),
      totalPrice: Number(appointment.price) - Number(appointment.discountAmount),
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
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
};

/**
 * Yeni randevu oluşturma
 */
export const createAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createAppointmentSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { customer: customerData, serviceId, staffId, appointmentDate, startTime, notes } = value;

    // Hizmet bilgilerini al
    const service = await Service.findByPk(serviceId);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }

    // Personel bilgilerini al
    const staff = await Staff.findByPk(staffId);
    if (!staff || !staff.isActive) {
      throw ApiError.notFound('Personel bulunamadı veya aktif değil');
    }

    // Bitiş saatini hesapla - parseISO yerine Date constructor kullanıyoruz
    const appointmentDateStr = format(new Date(appointmentDate), 'yyyy-MM-dd');
    const startDateTime = new Date(`${appointmentDateStr}T${startTime}:00`);
    const endDateTime = addMinutes(startDateTime, service.duration);
    const endTime = format(endDateTime, 'HH:mm');

    // Zaman çakışması kontrolü
    const conflictingAppointment = await Appointment.findOne({
      where: {
        staffId: staffId,
        appointmentDate: appointmentDateStr,
        [Op.and]: [
          {
            [Op.or]: [
              // Yeni randevu mevcut randevunun içinde başlıyor
              {
                startTime: { [Op.lte]: startTime },
                endTime: { [Op.gt]: startTime }
              },
              // Yeni randevu mevcut randevunun içinde bitiyor
              {
                startTime: { [Op.lt]: endTime },
                endTime: { [Op.gte]: endTime }
              },
              // Yeni randevu mevcut randevuyu kapsıyor
              {
                startTime: { [Op.gte]: startTime },
                endTime: { [Op.lte]: endTime }
              }
            ]
          }
        ]
      },
      include: [{
        model: AppointmentStatus,
        as: 'status',
        where: {
          name: { [Op.not]: 'cancelled' }
        }
      }]
    });

    if (conflictingAppointment) {
      throw ApiError.conflict('Bu saatte başka bir randevu mevcut');
    }

    // Müşteri kontrolü (varsa getir, yoksa oluştur)
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
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone
      });
    }

    // Pending status'ını al
    const pendingStatus = await AppointmentStatus.findOne({ where: { name: 'pending' } });
    if (!pendingStatus) {
      throw ApiError.internal('Randevu durumu bulunamadı');
    }

    // Randevu oluştur
    const appointment = await Appointment.create({
      customerId: customer.id,
      staffId: staffId,
      serviceId: serviceId,
      statusId: pendingStatus.id,
      appointmentDate: appointmentDateStr,
      startTime: startTime,
      endTime: endTime,
              price: service.price,
        discountAmount: 0,
      notes: notes || '',
      createdByAdmin: req.user?.userType === 'admin' ? req.user.id : null
    });

    // Randevu geçmişi kaydet
    await AppointmentHistory.create({
      appointment_id: appointment.id,
      status_id: pendingStatus.id,
      notes: 'Randevu oluşturuldu',
      created_by_admin: req.user?.userType === 'admin' ? req.user.id : null
    });

    // Tam randevu bilgilerini getir
    const fullAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'duration']
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'firstName', 'lastName', 'specialties']
        },
        {
          model: AppointmentStatus,
          as: 'status',
          attributes: ['id', 'name', 'displayName']
        }
      ]
    });

    res.status(201).json(ApiSuccess.created(fullAppointment, 'Randevu başarıyla oluşturuldu'));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
};

/**
 * Randevu durumu güncelleme
 */
export const updateAppointmentStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error: idError, value: idValue } = appointmentIdSchema.validate(req.params);
    if (idError) {
      throw ApiError.fromJoi(idError);
    }

    const { error: bodyError, value: bodyValue } = updateAppointmentStatusSchema.validate(req.body);
    if (bodyError) {
      throw ApiError.fromJoi(bodyError);
    }

    const appointment = await Appointment.findByPk(idValue.id);
    if (!appointment) {
      throw ApiError.notFound('Randevu bulunamadı');
    }

    // Yeni status'ı al
    const newStatus = await AppointmentStatus.findOne({ where: { name: bodyValue.status } });
    if (!newStatus) {
      throw ApiError.badRequest('Geçersiz randevu durumu');
    }

    // Randevu durumunu güncelle
    await appointment.update({
      statusId: newStatus.id,
      notes: bodyValue.notes || appointment.notes
    });

    // Randevu geçmişi kaydet
    await AppointmentHistory.create({
      appointment_id: appointment.id,
      status_id: newStatus.id,
      notes: bodyValue.notes || `Durum güncellendi: ${newStatus.display_name}`,
      created_by_admin: req.user?.userType === 'admin' ? req.user.id : null
    });

    // Güncellenmiş randevu bilgilerini getir
    const updatedAppointment = await Appointment.findByPk(idValue.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'duration']
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'first_name', 'last_name', 'specialization']
        },
        {
          model: AppointmentStatus,
          as: 'status',
          attributes: ['id', 'name', 'display_name']
        }
      ]
    });

    res.json(ApiSuccess.updated(updatedAppointment, 'Randevu durumu başarıyla güncellendi'));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
};

/**
 * Takvim görünümü için randevular
 */
export const getCalendarAppointments = async (req: Request, res: Response): Promise<void> => {
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
          attributes: ['firstName', 'lastName', 'phone']
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
          attributes: ['name', 'displayName']
        }
      ],
      order: [['appointmentDate', 'ASC'], ['startTime', 'ASC']]
    });

    // Takvim formatında düzenle
    const calendarEvents = appointments.map((appointment: any) => {
      const startDateTime = `${appointment.appointmentDate}T${appointment.startTime}:00`;
      const endDateTime = `${appointment.appointmentDate}T${appointment.endTime}:00`;
      
      // Status'a göre renk belirleme
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'pending': return { backgroundColor: '#ffc107', borderColor: '#ffc107' };
          case 'confirmed': return { backgroundColor: '#28a745', borderColor: '#28a745' };
          case 'completed': return { backgroundColor: '#6c757d', borderColor: '#6c757d' };
          case 'cancelled': return { backgroundColor: '#dc3545', borderColor: '#dc3545' };
          default: return { backgroundColor: '#6c757d', borderColor: '#6c757d' };
        }
      };

      const colors = getStatusColor(appointment.status.name);

      return {
        id: appointment.id,
        title: `${appointment.customer.firstName} ${appointment.customer.lastName} - ${appointment.service.name}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        extendedProps: {
          customerName: `${appointment.customer.firstName} ${appointment.customer.lastName}`,
          serviceName: appointment.service.name,
          staffName: `${appointment.staff.firstName} ${appointment.staff.lastName}`,
          phone: appointment.customer.phone,
          status: appointment.status.displayName,
          statusName: appointment.status.name,
          price: Number(appointment.price),
          discountAmount: Number(appointment.discountAmount),
          totalPrice: Number(appointment.price) - Number(appointment.discountAmount),
          notes: appointment.notes
        }
      };
    });

    res.json(ApiSuccess.item(calendarEvents, 'Takvim randevuları başarıyla getirildi'));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
};

/**
 * Randevu detayı
 */
export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
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
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'price', 'duration', 'description']
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'first_name', 'last_name', 'specialization', 'phone']
        },
        {
          model: AppointmentStatus,
          as: 'status',
          attributes: ['id', 'name', 'display_name']
        },
        {
          model: AppointmentHistory,
          as: 'history',
          include: [
            {
              model: AppointmentStatus,
              as: 'status',
              attributes: ['name', 'display_name']
            }
          ],
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!appointment) {
      throw ApiError.notFound('Randevu bulunamadı');
    }

    res.json(ApiSuccess.item(appointment, 'Randevu detayı başarıyla getirildi'));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
}; 