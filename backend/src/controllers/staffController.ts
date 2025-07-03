import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';
import { 
  createStaffSchema, 
  updateStaffSchema,
  staffListQuerySchema,
  staffIdSchema,
  availableSlotsQuerySchema
} from '../validations/staffValidation';

import db from '../models/index';
const { Staff, Service } = db;

export const getStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = staffListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { page, limit, isActive, sortBy, sortOrder } = value;
    const whereConditions: any = {};
    if (typeof isActive === 'boolean') {
      whereConditions.isActive = isActive;
    }
    const offset = (page - 1) * limit;
    const orderBy: any[] = [];
    if (sortBy === 'name') {
      orderBy.push(['fullName', sortOrder.toUpperCase()]);
    } else {
      orderBy.push([sortBy, sortOrder.toUpperCase()]);
    }
    const { count, rows } = await Staff.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Service,
          as: 'services',
          through: { attributes: [] },
          attributes: ['id', 'title', 'price', 'duration']
        }
      ],
      order: orderBy,
      limit,
      offset,
      distinct: true
    });
    const totalPages = Math.ceil(count / limit);
    const paginationInfo = {
      currentPage: page,
      totalPages,
      totalItems: count,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
    res.json(ApiSuccess.list(rows, paginationInfo, 'Personeller başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getStaffById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = staffIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { id } = value;
    const staff = await Staff.findByPk(id, {
      include: [
        {
          model: Service,
          as: 'services',
          through: { attributes: [] },
          attributes: ['id', 'title', 'price', 'duration']
        }
      ]
    });
    if (!staff) {
      throw ApiError.notFound('Personel bulunamadı');
    }
    res.json(ApiSuccess.item(staff, 'Personel detayları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = createStaffSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { fullName, email, phone, specialties, avatar, serviceIds } = value;
    const existingStaff = await Staff.findOne({
      where: { email: { [Op.iLike]: email } }
    });
    if (existingStaff) {
      throw ApiError.conflict('Bu email adresi ile kayıtlı personel zaten mevcut');
    }
    const staff = await Staff.create({
      fullName,
      email,
      phone,
      specialties,
      avatar,
      isActive: true
    });
    if (serviceIds && serviceIds.length > 0) {
      await staff.setServices(serviceIds);
    }
    const createdStaff = await Staff.findByPk(staff.id, {
      include: [
        {
          model: Service,
          as: 'services',
          through: { attributes: [] },
          attributes: ['id', 'title', 'price', 'duration']
        }
      ]
    });
    res.status(201).json(ApiSuccess.created(createdStaff, 'Personel başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error: paramsError, value: paramsValue } = staffIdSchema.validate(req.params);
    if (paramsError) {
      throw ApiError.fromJoi(paramsError);
    }
    const { error: bodyError, value: bodyValue } = updateStaffSchema.validate(req.body);
    if (bodyError) {
      throw ApiError.fromJoi(bodyError);
    }
    const { id } = paramsValue;
    const updateData = bodyValue;
    const staff = await Staff.findByPk(id);
    if (!staff) {
      throw ApiError.notFound('Personel bulunamadı');
    }
    if (updateData.email && updateData.email !== staff.email) {
      const existingStaff = await Staff.findOne({
        where: { 
          email: { [Op.iLike]: updateData.email },
          id: { [Op.ne]: id }
        }
      });
      if (existingStaff) {
        throw ApiError.conflict('Bu email adresi ile kayıtlı başka personel mevcut');
      }
    }
    const { serviceIds, ...staffUpdateData } = updateData;
    await staff.update(staffUpdateData);
    if (serviceIds !== undefined) {
      await staff.setServices(serviceIds);
    }
    const updatedStaff = await Staff.findByPk(id, {
      include: [
        {
          model: Service,
          as: 'services',
          through: { attributes: [] },
          attributes: ['id', 'title', 'price', 'duration']
        }
      ]
    });
    res.json(ApiSuccess.updated(updatedStaff, 'Personel başarıyla güncellendi'));
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error: paramsError, value: paramsValue } = staffIdSchema.validate(req.params);
    if (paramsError) {
      throw ApiError.fromJoi(paramsError);
    }
    const { error: queryError, value: queryValue } = availableSlotsQuerySchema.validate(req.query);
    if (queryError) {
      throw ApiError.fromJoi(queryError);
    }
    const { id } = paramsValue;
    const { date, serviceId } = queryValue;
    const staff = await Staff.findByPk(id, {
      where: { isActive: true }
    });
    if (!staff) {
      throw ApiError.notFound('Personel bulunamadı veya aktif değil');
    }
    const service = await Service.findByPk(serviceId);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }
    // Basit slot hesaplama - gerçek implementasyon iş saatleri ve mevcut randevulara göre olmalı
    const slots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];
    res.json(ApiSuccess.item(slots, 'Müsait saatler başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
}; 