import { Request, Response } from 'express';
import { ApiError, ApiSuccess, handleControllerError } from '../utils';
import { AuthenticatedRequest } from '../types/express';
import { Op } from 'sequelize';
import { 
  createStaffSchema, 
  updateStaffSchema,
  staffListQuerySchema,
  staffIdSchema,
  availableSlotsQuerySchema
} from '../validations/staffValidation';
const db = require('../models');
const { Staff, Service,} = db;
export const getStaff = async (req: Request, res: Response): Promise<void> => {
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
      orderBy.push(['firstName', sortOrder.toUpperCase()], ['lastName', sortOrder.toUpperCase()]);
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
          attributes: ['id', 'name', 'price', 'duration']
        }
      ],
      order: orderBy,
      limit,
      offset,
      distinct: true
    });
    const totalPages = Math.ceil(count / limit);
          res.json(new ApiSuccess('Personeller başarıyla getirildi', {
        staff: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }));
  } catch (error) {
    handleControllerError(error, res, 'Personeller getirilirken hata oluştu');
  }
};
export const getStaffById = async (req: Request, res: Response): Promise<void> => {
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
          attributes: ['id', 'name', 'price', 'duration']
        }
      ]
    });
    if (!staff) {
      throw ApiError.notFound('Personel bulunamadı');
    }
    res.json(new ApiSuccess('Personel detayları başarıyla getirildi', staff));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Personel detayları getirilirken hata oluştu').toJSON());
    }
  }
};
export const createStaff = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createStaffSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { firstName, lastName, email, phone, specialization, bio, profileImage, serviceIds } = value;
    const existingStaff = await Staff.findOne({
      where: { email: { [Op.iLike]: email } }
    });
    if (existingStaff) {
      throw ApiError.conflict('Bu email adresi ile kayıtlı personel zaten mevcut');
    }
    const staff = await Staff.create({
      firstName: firstName,
      lastName: lastName,
      email,
      phone,
      specialties: specialization,
      bio,
      profileImage: profileImage,
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
          attributes: ['id', 'name', 'price', 'duration']
        }
      ]
    });
    res.status(201).json(new ApiSuccess('Personel başarıyla oluşturuldu', createdStaff));
  } catch (error) {
    console.error('Staff create error:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Personel oluşturulurken hata oluştu').toJSON());
    }
  }
};
export const updateStaff = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
          attributes: ['id', 'name', 'price', 'duration']
        }
      ]
    });
    res.json(new ApiSuccess('Personel başarıyla güncellendi', updatedStaff));
  } catch (error) {
    console.error('Staff update error:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Personel güncellenirken hata oluştu').toJSON());
    }
  }
};
export const getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
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
    const availableSlots = [
      { startTime: '09:00', endTime: '09:30', isAvailable: true },
      { startTime: '09:30', endTime: '10:00', isAvailable: true },
      { startTime: '10:00', endTime: '10:30', isAvailable: true },
      { startTime: '10:30', endTime: '11:00', isAvailable: false },
      { startTime: '11:00', endTime: '11:30', isAvailable: true },
      { startTime: '14:00', endTime: '14:30', isAvailable: true },
      { startTime: '14:30', endTime: '15:00', isAvailable: true },
      { startTime: '15:00', endTime: '15:30', isAvailable: true },
      { startTime: '15:30', endTime: '16:00', isAvailable: false },
      { startTime: '16:00', endTime: '16:30', isAvailable: true }
    ];
    res.json(new ApiSuccess('Müsait saatler başarıyla getirildi', { availableSlots }));
  } catch (error) {
    console.error('Available slots error:', error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Müsait saatler getirilirken hata oluştu').toJSON());
    }
  }
}; 