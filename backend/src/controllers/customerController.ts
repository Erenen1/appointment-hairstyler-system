import { Request, Response } from 'express';
import { ApiError, ApiSuccess, handleControllerError } from '../utils';
import { Op, fn, col } from 'sequelize';
import { 
  createCustomerSchema, 
  updateCustomerSchema,
  customerListQuerySchema,
  customerIdSchema
} from '../validations/customerValidation';
import { AuthenticatedRequest } from '../types/express';
const db = require('../models');
const { Customer, Appointment, Service, Staff, AppointmentStatus } = db;
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = customerListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { page, limit, search, sortBy, sortOrder } = value;
    const whereConditions: any = {};
    if (search) {
      whereConditions[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    const offset = (page - 1) * limit;
    const orderBy: any[] = [];
    if (sortBy === 'name') {
      orderBy.push(['firstName', sortOrder.toUpperCase()], ['lastName', sortOrder.toUpperCase()]);
    } else if (sortBy === 'totalSpent') {
      orderBy.push([fn('SUM', col('appointments.totalPrice')), sortOrder.toUpperCase()]);
    } else if (sortBy === 'lastVisit') {
      orderBy.push([fn('MAX', col('appointments.appointmentDate')), sortOrder.toUpperCase()]);
    } else {
      orderBy.push([sortBy, sortOrder.toUpperCase()]);
    }
    const { count, rows } = await Customer.findAndCountAll({
      where: whereConditions,
      attributes: [
        'id', 'firstName', 'lastName', 'email', 'phone', 'createdAt',
        [fn('COUNT', col('appointments.id')), 'visitCount'],
        [fn('SUM', col('appointments.totalPrice')), 'totalSpent'],
        [fn('MAX', col('appointments.appointmentDate')), 'lastVisit']
      ],
      include: [
        {
          model: Appointment,
          as: 'appointments',
          attributes: [],
          include: [{
            model: AppointmentStatus,
            as: 'status',
            where: { name: 'completed' },
            attributes: []
          }],
          required: false
        }
      ],
      group: ['Customer.id'],
      order: orderBy,
      limit,
      offset,
      subQuery: false,
      distinct: true
    });
    const totalPages = Math.ceil(count.length / limit);
    res.json(new ApiSuccess('Müşteriler başarıyla getirildi', {
      customers: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count.length,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }));
  } catch (error) {
    handleControllerError(error, res, 'Müşteriler getirilirken hata oluştu');
  }
};
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = customerIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { id } = value;
    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Appointment,
          as: 'appointments',
          include: [
            {
              model: Service,
              as: 'service',
              attributes: ['id', 'name', 'price']
            },
            {
              model: Staff,
              as: 'staff',
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: AppointmentStatus,
              as: 'status',
              attributes: ['id', 'name', 'displayName']
            }
          ],
          order: [['appointmentDate', 'DESC']]
        }
      ]
    });
    if (!customer) {
      throw ApiError.notFound('Müşteri bulunamadı');
    }
    const completedAppointments = customer.appointments.filter(
      (apt: any) => apt.status?.name === 'completed'
    );
    const totalSpent = completedAppointments.reduce(
      (sum: number, apt: any) => sum + (apt.totalPrice || 0), 0
    );
    const averageSpent = completedAppointments.length > 0 
      ? totalSpent / completedAppointments.length 
      : 0;
    const serviceCount: any = {};
    completedAppointments.forEach((apt: any) => {
      const serviceName = apt.service?.name;
      if (serviceName) {
        serviceCount[serviceName] = (serviceCount[serviceName] || 0) + 1;
      }
    });
    const favoriteServices = Object.entries(serviceCount)
      .map(([serviceName, count]) => ({ serviceName, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);
    const customerDetail = {
      ...customer.toJSON(),
      totalVisits: completedAppointments.length,
      totalSpent,
      averageSpent: Math.round(averageSpent * 100) / 100,
      favoriteServices
    };
    res.json(new ApiSuccess('Müşteri detayları başarıyla getirildi', customerDetail));
  } catch (error) {
    handleControllerError(error, res, 'Müşteri detayları getirilirken hata oluştu');
  }
};
export const createCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createCustomerSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { firstName, lastName, email, phone, notes } = value;
    const existingCustomer = await Customer.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { phone: phone }
        ]
      }
    });
    if (existingCustomer) {
      if (existingCustomer.email === email) {
        throw ApiError.conflict('Bu e-posta adresi zaten kullanımda');
      }
      if (existingCustomer.phone === phone) {
        throw ApiError.conflict('Bu telefon numarası zaten kullanımda');
      }
    }
    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      phone,
      notes
    });
    res.status(201).json(new ApiSuccess('Müşteri başarıyla oluşturuldu', customer));
  } catch (error) {
    handleControllerError(error, res, 'Müşteri oluşturulurken hata oluştu');
  }
};
export const updateCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error: paramsError, value: paramsValue } = customerIdSchema.validate(req.params);
    if (paramsError) {
      throw ApiError.fromJoi(paramsError);
    }
    const { error: bodyError, value: bodyValue } = updateCustomerSchema.validate(req.body);
    if (bodyError) {
      throw ApiError.fromJoi(bodyError);
    }
    const { id } = paramsValue;
    const updateData = bodyValue;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      throw ApiError.notFound('Müşteri bulunamadı');
    }
    if (updateData.email || updateData.phone) {
      const whereCondition: any = {
        id: { [Op.ne]: id }
      };
      const orConditions: any[] = [];
      if (updateData.email) {
        orConditions.push({ email: updateData.email });
      }
      if (updateData.phone) {
        orConditions.push({ phone: updateData.phone });
      }
      if (orConditions.length > 0) {
        whereCondition[Op.or] = orConditions;
      }
      const existingCustomer = await Customer.findOne({
        where: whereCondition
      });
      if (existingCustomer) {
        if (existingCustomer.email === updateData.email) {
          throw ApiError.conflict('Bu e-posta adresi başka bir müşteri tarafından kullanılıyor');
        }
        if (existingCustomer.phone === updateData.phone) {
          throw ApiError.conflict('Bu telefon numarası başka bir müşteri tarafından kullanılıyor');
        }
      }
    }
    await customer.update(updateData);
    res.json(new ApiSuccess('Müşteri başarıyla güncellendi', customer));
  } catch (error) {
    handleControllerError(error, res, 'Müşteri güncellenirken hata oluştu');
  }
};
export const deleteCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = customerIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { id } = value;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      throw ApiError.notFound('Müşteri bulunamadı');
    }
    const activeAppointments = await Appointment.count({
      where: {
        customerId: id,
        statusId: { [Op.in]: [1, 2] } 
      }
    });
    if (activeAppointments > 0) {
      throw ApiError.badRequest('Müşterinin aktif randevuları olduğu için silinemez');
    }
    await customer.destroy();
    res.json(new ApiSuccess('Müşteri başarıyla silindi'));
  } catch (error) {
    handleControllerError(error, res, 'Müşteri silinirken hata oluştu');
  }
}; 