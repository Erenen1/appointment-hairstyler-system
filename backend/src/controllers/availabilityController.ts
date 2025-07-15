import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';
import { format, addDays, startOfWeek, endOfWeek, getDay } from 'date-fns';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';

import db from '../models/index';
const { StaffAvailability, Staff, BusinessHours, Appointment, Service, StaffService } = db;

// Tüm personellerin belirli tarih aralığındaki müsaitlik durumunu getir
export const getAllStaffAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { startDate, endDate, serviceId } = req.query;
    
    if (!startDate || !endDate) {
      throw ApiError.badRequest('Başlangıç ve bitiş tarihi gereklidir');
    }

    // Aktif personelleri getir
    let staffWhereClause: any = { isActive: true };
    
    // Eğer serviceId verilmişse, sadece o hizmeti verebilen personelleri getir
    if (serviceId) {
      const staffIds = await StaffService.findAll({
        where: { serviceId, isActive: true },
        attributes: ['staffId']
      });
      staffWhereClause.id = { [Op.in]: staffIds.map(ss => ss.staffId) };
    }

    const staff = await Staff.findAll({
      where: staffWhereClause,
      attributes: ['id', 'fullName', 'avatar', 'specialties'],
      order: [['fullName', 'ASC']]
    });

    // İş saatlerini getir
    const businessHours = await BusinessHours.findAll({
      order: [['dayOfWeek', 'ASC']]
    });

    const result = await Promise.all(staff.map(async (staffMember) => {
      const availability = await getStaffAvailabilityForRange(
        staffMember.id, 
        new Date(startDate as string), 
        new Date(endDate as string), 
        businessHours
      );
      
      return {
        staff: {
          id: staffMember.id,
          fullName: staffMember.fullName,
          avatar: staffMember.avatar,
          specialties: staffMember.specialties
        },
        availability
      };
    }));

    res.json(ApiSuccess.list(result, null, 'Tüm personel müsaitlik durumları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

// Belirli personelin müsaitlik durumunu getir
export const getStaffAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { staffId, date, startDate, endDate, type, isAvailable } = req.query;
    const whereConditions: any = {};

    if (staffId) whereConditions.staffId = staffId;
    if (date) whereConditions.date = date;
    if (startDate || endDate) {
      whereConditions.date = {};
      if (startDate) whereConditions.date[Op.gte] = startDate;
      if (endDate) whereConditions.date[Op.lte] = endDate;
    }
    if (type) whereConditions.type = type;
    if (isAvailable !== undefined) whereConditions.isAvailable = isAvailable === 'true';

    const availability = await StaffAvailability.findAll({
      where: whereConditions,
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'fullName', 'avatar']
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });

    res.json(ApiSuccess.list(availability, null, 'Müsaitlik durumları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

// Yeni müsaitlik oluştur
export const createAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { staffId, date, startTime, endTime, lunchBreakStart, lunchBreakEnd, type, notes } = req.body;

    // Personelin varlığını kontrol et
    const staff = await Staff.findByPk(staffId);
    if (!staff || !staff.isActive) {
      throw ApiError.notFound('Personel bulunamadı veya aktif değil');
    }

    // Tarihin gün bilgisini al (1 = Pazartesi, 7 = Pazar)
    const dayOfWeek = new Date(date).getDay() || 7; // JS'de Pazar = 0, biz 7 yapıyoruz

    // Mevcut müsaitlik kaydını kontrol et
    const existingAvailability = await StaffAvailability.findOne({
      where: { staffId, date }
    });

    if (existingAvailability) {
      throw ApiError.conflict('Bu tarih için zaten bir müsaitlik kaydı mevcut');
    }

    const availability = await StaffAvailability.create({
      staffId,
      date,
      dayOfWeek,
      startTime,
      endTime,
      lunchBreakStart,
      lunchBreakEnd,
      isAvailable: type !== 'off',
      type,
      notes
    });

    const createdAvailability = await StaffAvailability.findByPk(availability.id, {
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'fullName']
        }
      ]
    });

    res.status(201).json(ApiSuccess.created(createdAvailability, 'Müsaitlik kaydı başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
};

// Toplu müsaitlik oluştur
export const bulkCreateAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { staffId, dateRange, workingDays, schedule } = req.body;

    // Personelin varlığını kontrol et
    const staff = await Staff.findByPk(staffId);
    if (!staff || !staff.isActive) {
      throw ApiError.notFound('Personel bulunamadı veya aktif değil');
    }

    // Tarih aralığındaki tüm günleri al
    const dates = eachDayOfInterval({
      start: new Date(dateRange.startDate),
      end: new Date(dateRange.endDate)
    });

    const availabilityRecords = [];

    for (const date of dates) {
      const dayOfWeek = getDay(date) || 7; // JS'de Pazar = 0, biz 7 yapıyoruz
      
      // Sadece seçilen çalışma günlerinde kayıt oluştur
      if (workingDays.includes(dayOfWeek)) {
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Mevcut müsaitlik kaydını kontrol et
        const existingAvailability = await StaffAvailability.findOne({
          where: { staffId, date: dateStr }
        });
        
        // Eğer kayıt yoksa oluştur
        if (!existingAvailability) {
          availabilityRecords.push({
            staffId,
            date: dateStr,
            dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            lunchBreakStart: schedule.lunchBreakStart,
            lunchBreakEnd: schedule.lunchBreakEnd,
            isAvailable: true,
            type: 'default',
            notes: schedule.notes || null
          });
        }
      }
    }

    if (availabilityRecords.length === 0) {
      throw ApiError.badRequest('Seçilen tarih aralığında oluşturulacak müsaitlik kaydı bulunamadı');
    }

    await StaffAvailability.bulkCreate(availabilityRecords);

    res.status(201).json(ApiSuccess.created({
      count: availabilityRecords.length,
      dateRange,
      workingDays
    }, `${availabilityRecords.length} adet müsaitlik kaydı başarıyla oluşturuldu`));
  } catch (error) {
    next(error);
  }
};

// Müsaitlik güncelle
export const updateAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { startTime, endTime, lunchBreakStart, lunchBreakEnd, isAvailable, type, notes } = req.body;

    const availability = await StaffAvailability.findByPk(id);
    if (!availability) {
      throw ApiError.notFound('Müsaitlik kaydı bulunamadı');
    }

    await availability.update({
      startTime: startTime || availability.startTime,
      endTime: endTime || availability.endTime,
      lunchBreakStart: lunchBreakStart !== undefined ? lunchBreakStart : availability.lunchBreakStart,
      lunchBreakEnd: lunchBreakEnd !== undefined ? lunchBreakEnd : availability.lunchBreakEnd,
      isAvailable: isAvailable !== undefined ? isAvailable : availability.isAvailable,
      type: type || availability.type,
      notes: notes !== undefined ? notes : availability.notes
    });

    const updatedAvailability = await StaffAvailability.findByPk(id, {
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'fullName']
        }
      ]
    });

    res.json(ApiSuccess.updated(updatedAvailability, 'Müsaitlik kaydı başarıyla güncellendi'));
  } catch (error) {
    next(error);
  }
};

// Müsaitlik sil
export const deleteAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const availability = await StaffAvailability.findByPk(id);
    if (!availability) {
      throw ApiError.notFound('Müsaitlik kaydı bulunamadı');
    }

    await availability.destroy();

    res.json(ApiSuccess.deleted('Müsaitlik kaydı başarıyla silindi'));
  } catch (error) {
    next(error);
  }
};

// Yardımcı fonksiyon: Belirli tarih aralığındaki müsaitlik durumunu hesapla
async function getStaffAvailabilityForRange(staffId: string, startDate: Date, endDate: Date, businessHours: any[]) {
  // Tarih aralığındaki tüm günleri al
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Personelin özel müsaitlik kayıtlarını getir
  const staffAvailability = await StaffAvailability.findAll({
    where: {
      staffId,
      date: {
        [Op.between]: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
      }
    }
  });
  
  // Personelin randevularını getir
  const appointments = await Appointment.findAll({
    where: {
      staffId,
      appointmentDate: {
        [Op.between]: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
      }
    },
    include: [
      {
        model: Service,
        as: 'service',
        attributes: ['id', 'title', 'duration']
      }
    ]
  });
  
  // Her gün için müsaitlik durumunu hesapla
  return dates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay() || 7; // JS'de Pazar = 0, biz 7 yapıyoruz
    
    // Personelin bu tarih için özel müsaitlik kaydını bul
    const customAvailability = staffAvailability.find(a => format(new Date(a.date), 'yyyy-MM-dd') === dateStr);
    
    // İş saatleri tablosundan bu gün için varsayılan saatleri bul
    const defaultHours = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
    
    // Eğer özel müsaitlik kaydı varsa onu kullan, yoksa varsayılan iş saatlerini kullan
    let dayAvailability;
    
    if (customAvailability) {
      dayAvailability = {
        date: dateStr,
        dayOfWeek,
        isAvailable: customAvailability.isAvailable,
        type: customAvailability.type,
        startTime: customAvailability.startTime,
        endTime: customAvailability.endTime,
        lunchBreakStart: customAvailability.lunchBreakStart,
        lunchBreakEnd: customAvailability.lunchBreakEnd,
        notes: customAvailability.notes,
        isCustom: true
      };
    } else if (defaultHours && !defaultHours.isClosed) {
      dayAvailability = {
        date: dateStr,
        dayOfWeek,
        isAvailable: true,
        type: 'default',
        startTime: defaultHours.openTime,
        endTime: defaultHours.closeTime,
        isCustom: false
      };
    } else {
      dayAvailability = {
        date: dateStr,
        dayOfWeek,
        isAvailable: false,
        type: 'off',
        isCustom: false
      };
    }
    
    // Bu tarihteki randevuları bul
    const dayAppointments = appointments.filter(a => format(new Date(a.appointmentDate), 'yyyy-MM-dd') === dateStr);
    
    return {
      ...dayAvailability,
      appointments: dayAppointments.map(a => ({
        id: a.id,
        startTime: a.startTime,
        endTime: a.endTime,
        service: a.service ? {
          id: a.service.id,
          title: a.service.title,
          duration: a.service.duration
        } : null
      }))
    };
  });
} 