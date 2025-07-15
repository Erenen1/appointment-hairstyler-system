import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col } from 'sequelize';

import db from '../models/index';
const { Customer, Appointment, Service, Staff } = db;

export const getCustomers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;
    
    const whereConditions: any = {};
    if (search) {
      whereConditions[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const offset = (Number(page) - 1) * Number(limit);
    const orderBy: any[] = [];
    if (sortBy === 'name') {
      orderBy.push(['fullName', String(sortOrder).toUpperCase()]);
    } else if (sortBy === 'totalSpent') {
      orderBy.push([fn('SUM', col('appointments.price')), String(sortOrder).toUpperCase()]);
    } else if (sortBy === 'lastVisit') {
      orderBy.push([fn('MAX', col('appointments.appointmentDate')), String(sortOrder).toUpperCase()]);
    } else {
      orderBy.push([sortBy, String(sortOrder).toUpperCase()]);
    }
    
    const { count, rows } = await Customer.findAndCountAll({
      where: whereConditions,
      attributes: [
        'id', 'fullName', 'email', 'phone', 'createdAt',
        [fn('COUNT', col('appointments.id')), 'visitCount'],
        [fn('SUM', col('appointments.price')), 'totalSpent'],
        [fn('MAX', col('appointments.appointmentDate')), 'lastVisit']
      ],
      include: [
        {
          model: Appointment,
          as: 'appointments',
          attributes: [],
          required: false
        }
      ],
      group: ['Customer.id'],
      order: orderBy,
      limit: Number(limit),
      offset,
      subQuery: false,
      distinct: true
    });
    
    const totalPages = Math.ceil(count.length / Number(limit));
    const paginationInfo = {
      currentPage: Number(page),
      totalPages,
      totalItems: count.length,
      itemsPerPage: Number(limit),
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1
    };
    
    res.json(ApiSuccess.list(rows, paginationInfo, 'Müşteriler başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Appointment,
          as: 'appointments',
          include: [
            {
              model: Service,
              as: 'service',
              attributes: ['id', 'title', 'price']
            },
            {
              model: Staff,
              as: 'staff',
              attributes: ['id', 'fullName']
            }
          ],
          order: [['appointmentDate', 'DESC']]
        }
      ]
    });
    
    if (!customer) {
      throw ApiError.notFound('Müşteri bulunamadı');
    }
    
    const completedAppointments = customer.appointments;
    const totalSpent = completedAppointments.reduce(
      (sum: number, apt: any) => sum + (apt.price || 0), 0
    );
    const averageSpent = completedAppointments.length > 0 
      ? totalSpent / completedAppointments.length 
      : 0;
    
    const serviceCount: any = {};
    completedAppointments.forEach((apt: any) => {
      const serviceName = apt.service?.title;
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
    
    res.json(ApiSuccess.item(customerDetail, 'Müşteri detayları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, phone, notes } = req.body;
    
    if (!fullName || !email || !phone) {
      throw ApiError.badRequest('Ad-soyad, e-posta ve telefon alanları zorunludur');
    }
    
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
      fullName,
      email,
      phone,
      notes
    });
    
    res.status(201).json(ApiSuccess.created(customer, 'Müşteri başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
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
        const existingCustomer = await Customer.findOne({ where: whereCondition });
        
        if (existingCustomer) {
          if (updateData.email && existingCustomer.email === updateData.email) {
            throw ApiError.conflict('Bu e-posta adresi zaten kullanımda');
          }
          if (updateData.phone && existingCustomer.phone === updateData.phone) {
            throw ApiError.conflict('Bu telefon numarası zaten kullanımda');
          }
        }
      }
    }
    
    await customer.update(updateData);
    
    res.json(ApiSuccess.updated(customer, 'Müşteri başarıyla güncellendi'));
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const customer = await Customer.findByPk(id);
    if (!customer) {
      throw ApiError.notFound('Müşteri bulunamadı');
    }
    
    await customer.destroy();
    
    res.json(ApiSuccess.deleted('Müşteri başarıyla silindi'));
  } catch (error) {
    next(error);
  }
}; 