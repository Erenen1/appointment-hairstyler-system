import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';
import { format, addDays, startOfWeek, endOfWeek, getDay } from 'date-fns';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import { 
  createAvailabilitySchema,
  updateAvailabilitySchema,
  availabilityQuerySchema,
  availabilityIdSchema,
  bulkCreateAvailabilitySchema,
  dateRangeQuerySchema
} from '../validations/availabilityValidation';

import db from '../models/index';
const { StaffAvailability, Staff, BusinessHours, Appointment, Service, StaffService } = db;

// Tüm personellerin belirli tarih aralığındaki müsaitlik durumunu getir
export const getAllStaffAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = dateRangeQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    
    const { startDate, endDate, serviceId } = value;

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
        startDate, 
        endDate, 
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
    const { error, value } = availabilityQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { staffId, date, startDate, endDate, type, isAvailable } = value;
    const whereConditions: any = {};

    if (staffId) whereConditions.staffId = staffId;
    if (date) whereConditions.date = date;
    if (startDate || endDate) {
      whereConditions.date = {};
      if (startDate) whereConditions.date[Op.gte] = startDate;
      if (endDate) whereConditions.date[Op.lte] = endDate;
    }
    if (type) whereConditions.type = type;
    if (isAvailable !== undefined) whereConditions.isAvailable = isAvailable;

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
    const { error, value } = createAvailabilitySchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { staffId, date, startTime, endTime, lunchBreakStart, lunchBreakEnd, type, notes } = value;

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
    const { error, value } = bulkCreateAvailabilitySchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { staffId, dateRange, workingDays, schedule } = value;

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
        
        // Mevcut kayıt var mı kontrol et
        const existingRecord = await StaffAvailability.findOne({
          where: { staffId, date: dateStr }
        });

        if (!existingRecord) {
          availabilityRecords.push({
            staffId,
            date: dateStr,
            dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            lunchBreakStart: schedule.lunchBreakStart,
            lunchBreakEnd: schedule.lunchBreakEnd,
            isAvailable: true,
            type: 'default'
          });
        }
      }
    }

    if (availabilityRecords.length === 0) {
      throw ApiError.badRequest('Oluşturulacak yeni müsaitlik kaydı bulunamadı');
    }

    const createdRecords = await StaffAvailability.bulkCreate(availabilityRecords);

    res.status(201).json(ApiSuccess.created(
      { count: createdRecords.length, records: createdRecords },
      `${createdRecords.length} adet müsaitlik kaydı başarıyla oluşturuldu`
    ));
  } catch (error) {
    next(error);
  }
};

// Müsaitlik güncelle
export const updateAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error: paramsError, value: paramsValue } = availabilityIdSchema.validate(req.params);
    if (paramsError) {
      throw ApiError.fromJoi(paramsError);
    }

    const { error: bodyError, value: bodyValue } = updateAvailabilitySchema.validate(req.body);
    if (bodyError) {
      throw ApiError.fromJoi(bodyError);
    }

    const { id } = paramsValue;
    const availability = await StaffAvailability.findByPk(id);
    
    if (!availability) {
      throw ApiError.notFound('Müsaitlik kaydı bulunamadı');
    }

    await availability.update(bodyValue);

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
    const { error, value } = availabilityIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { id } = value;
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

// Yardımcı fonksiyon: Belirli tarih aralığında personelin müsaitlik durumunu hesapla
async function getStaffAvailabilityForRange(staffId: string, startDate: Date, endDate: Date, businessHours: any[]) {
  // Belirlenen tarih aralığındaki tüm günleri al
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Bu tarih aralığındaki mevcut müsaitlik kayıtlarını getir
  const existingAvailability = await StaffAvailability.findAll({
    where: {
      staffId,
      date: {
        [Op.between]: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
      }
    }
  });

  // Bu tarih aralığındaki randevuları getir
  const appointments = await Appointment.findAll({
    where: {
      staffId,
      appointmentDate: {
        [Op.between]: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
      }
    },
    attributes: ['appointmentDate', 'startTime', 'endTime']
  });

  return dates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = getDay(date) || 7;
    
    // Mevcut müsaitlik kaydını bul
    const availabilityRecord = existingAvailability.find(av => av.date === dateStr);
    
    // İş saatlerini bul
    const businessHour = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
    
    // O gün randevuları
    const dayAppointments = appointments.filter(apt => apt.appointmentDate === dateStr);
    
    if (availabilityRecord) {
      // Özel müsaitlik kaydı varsa onu kullan
      return {
        date: dateStr,
        dayOfWeek,
        isAvailable: availabilityRecord.isAvailable,
        type: availabilityRecord.type,
        workingHours: availabilityRecord.isAvailable ? {
          start: availabilityRecord.startTime,
          end: availabilityRecord.endTime,
          lunchBreak: availabilityRecord.lunchBreakStart && availabilityRecord.lunchBreakEnd ? {
            start: availabilityRecord.lunchBreakStart,
            end: availabilityRecord.lunchBreakEnd
          } : null
        } : null,
        appointments: dayAppointments.map(apt => ({
          startTime: apt.startTime,
          endTime: apt.endTime
        })),
        notes: availabilityRecord.notes
      };
    } else if (businessHour && !businessHour.isClosed) {
      // İş saatleri varsa onları kullan
      return {
        date: dateStr,
        dayOfWeek,
        isAvailable: true,
        type: 'default',
        workingHours: {
          start: businessHour.openTime,
          end: businessHour.closeTime,
          lunchBreak: {
            start: '12:00:00',
            end: '13:00:00'
          }
        },
        appointments: dayAppointments.map(apt => ({
          startTime: apt.startTime,
          endTime: apt.endTime
        })),
        notes: null
      };
    } else {
      // Kapalı gün
      return {
        date: dateStr,
        dayOfWeek,
        isAvailable: false,
        type: 'off',
        workingHours: null,
        appointments: [],
        notes: 'Salon kapalı'
      };
    }
  });
} 