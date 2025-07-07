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
const { Staff, StaffService, Service, ServiceCategory } = db;

export const getStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = staffListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { page, limit, isActive } = value;
    const whereConditions: any = {};
    if (typeof isActive === 'boolean') {
      whereConditions.isActive = isActive;
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Staff.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Service,
          as: 'services',
          through: {
            model: StaffService,
            attributes: ['isActive']
          },
          attributes: ['id', 'title', 'price', 'duration'],
          include: [
            {
              model: ServiceCategory,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      limit,
      offset,
      distinct: true
    });

    const formattedStaff = rows.map(staff => ({
      id: staff.id,
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      specialties: staff.specialties,
      avatar: staff.avatar,
      isActive: staff.isActive,
      services: staff.services?.filter(service => service.StaffService?.isActive)?.map(service => ({
        id: service.id,
        title: service.title,
        price: service.price,
        duration: service.duration,
        category: service.category
      })) || [],
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt
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
    res.json(ApiSuccess.list(formattedStaff, paginationInfo, 'Personeller başarıyla getirildi'));
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
          through: {
            model: StaffService,
            attributes: ['isActive']
          },
          attributes: ['id', 'title', 'description', 'price', 'duration'],
          include: [
            {
              model: ServiceCategory,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    if (!staff) {
      throw ApiError.notFound('Personel bulunamadı');
    }

    const formattedStaff = {
      ...staff.toJSON(),
      services: staff.services?.filter(service => service.StaffService?.isActive)?.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category
      })) || []
    };

    res.json(ApiSuccess.item(formattedStaff, 'Personel detayları başarıyla getirildi'));
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

    // Staff-Service ilişkilerini oluştur
    if (serviceIds && serviceIds.length > 0) {
      await Promise.all(
        serviceIds.map(serviceId => 
          StaffService.create({
            staffId: staff.id,
            serviceId: serviceId,
            isActive: true
          })
        )
      );
    }

    // Oluşturulan personeli service bilgileriyle birlikte getir
    const staffWithServices = await Staff.findByPk(staff.id, {
      include: [
        {
          model: Service,
          as: 'services',
          through: {
            model: StaffService,
            attributes: ['isActive']
          },
          attributes: ['id', 'title', 'price', 'duration'],
          include: [
            {
              model: ServiceCategory,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    res.status(201).json(ApiSuccess.created(staffWithServices, 'Personel başarıyla oluşturuldu'));
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
    const updatedStaff = await staff.update(staffUpdateData);

    // Service ilişkilerini güncelle
    if (serviceIds && Array.isArray(serviceIds)) {
      // Önce mevcut ilişkileri sil
      await StaffService.destroy({
        where: { staffId: id }
      });
      
      // Yeni ilişkileri oluştur
      if (serviceIds.length > 0) {
        await Promise.all(
          serviceIds.map(serviceId => 
            StaffService.create({
              staffId: id,
              serviceId: serviceId,
              isActive: true
            })
          )
        );
      }
    }

    // Güncellenmiş personeli service bilgileriyle birlikte getir
    const updatedStaffWithServices = await Staff.findByPk(id, {
      include: [
        {
          model: Service,
          as: 'services',
          through: {
            model: StaffService,
            attributes: ['isActive']
          },
          attributes: ['id', 'title', 'price', 'duration'],
          include: [
            {
              model: ServiceCategory,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    res.json(ApiSuccess.updated(updatedStaffWithServices, 'Personel başarıyla güncellendi'));
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
    const { date } = queryValue;

    const staff = await Staff.findByPk(id, {
      where: { isActive: true }
    });
    if (!staff) {
      throw ApiError.notFound('Personel bulunamadı veya aktif değil');
    }

    // Tarihi string formatına çevir
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const targetDate = new Date(dateStr);
    const dayOfWeek = targetDate.getDay() || 7; // JS'de Pazar = 0, biz 7 yapıyoruz

    // Personelin o tarih için özel müsaitlik kaydını kontrol et
    const staffAvailability = await db.StaffAvailability.findOne({
      where: {
        staffId: id,
        date: dateStr
      }
    });

    let workingHours;

    if (staffAvailability) {
      // Özel müsaitlik kaydı varsa
      if (!staffAvailability.isAvailable) {
        res.json(ApiSuccess.item({
          date: dateStr,
          staffId: id,
          staffName: staff.fullName,
          isAvailable: false,
          reason: staffAvailability.notes || 'Personel bu tarihte müsait değil',
          availableSlots: [],
          totalSlots: 0
        }, 'Personel bu tarihte müsait değil'));
        return;
      }

      workingHours = {
        start: staffAvailability.startTime,
        end: staffAvailability.endTime,
        lunchBreak: staffAvailability.lunchBreakStart && staffAvailability.lunchBreakEnd ? {
          start: staffAvailability.lunchBreakStart,
          end: staffAvailability.lunchBreakEnd
        } : null
      };
    } else {
      // İş saatlerini kontrol et
      const businessHour = await db.BusinessHours.findOne({
        where: { dayOfWeek }
      });

      if (!businessHour || businessHour.isClosed) {
        res.json(ApiSuccess.item({
          date: dateStr,
          staffId: id,
          staffName: staff.fullName,
          isAvailable: false,
          reason: 'Salon bu gün kapalı',
          availableSlots: [],
          totalSlots: 0
        }, 'Salon bu gün kapalı'));
        return;
      }

      workingHours = {
        start: businessHour.openTime,
        end: businessHour.closeTime,
        lunchBreak: {
          start: '12:00:00',
          end: '13:00:00'
        }
      };
    }

    // O tarihteki mevcut randevuları getir
    const existingAppointments = await db.Appointment.findAll({
      where: {
        staffId: id,
        appointmentDate: dateStr
      },
      attributes: ['startTime', 'endTime'],
      order: [['startTime', 'ASC']]
    });

    // Çalışma saatlerini parse et
    const startHour = parseInt(workingHours.start.split(':')[0]);
    const startMinute = parseInt(workingHours.start.split(':')[1]);
    const endHour = parseInt(workingHours.end.split(':')[0]);
    const endMinute = parseInt(workingHours.end.split(':')[1]);

    // 30 dakika aralıklarla slot'ları oluştur
    const allSlots: string[] = [];
    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      allSlots.push(timeStr);

      // 30 dakika ekle
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    // Kullanılamayan saatleri filtrele
    const availableSlots = allSlots.filter(slot => {
      // Öğle molasını kontrol et
      if (workingHours.lunchBreak) {
        const lunchStart = workingHours.lunchBreak.start.substring(0, 5); // HH:MM format
        const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
        if (slot >= lunchStart && slot < lunchEnd) {
          return false;
        }
      }

      // Mevcut randevularla çakışma kontrolü
      return !existingAppointments.some(appointment => {
        const appointmentStart = appointment.startTime.substring(0, 5);
        const appointmentEnd = appointment.endTime.substring(0, 5);
        return slot >= appointmentStart && slot < appointmentEnd;
      });
    });

    // Saat formatını düzenle ve ek bilgi ekle
    const formattedSlots = availableSlots.map(slot => ({
      time: slot,
      displayTime: slot,
      available: true
    }));

    const response = {
      date: dateStr,
      staffId: id,
      staffName: staff.fullName,
      isAvailable: true,
      availableSlots: formattedSlots,
      totalSlots: formattedSlots.length,
      workingHours: {
        start: workingHours.start.substring(0, 5),
        end: workingHours.end.substring(0, 5),
        lunchBreak: workingHours.lunchBreak ? 
          `${workingHours.lunchBreak.start.substring(0, 5)} - ${workingHours.lunchBreak.end.substring(0, 5)}` : 
          null
      },
      existingAppointments: existingAppointments.map(apt => ({
        startTime: apt.startTime.substring(0, 5),
        endTime: apt.endTime.substring(0, 5)
      }))
    };

    res.json(ApiSuccess.item(response, 'Müsait saatler başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
}; 