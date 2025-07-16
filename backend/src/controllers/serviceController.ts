import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';
import { format } from 'date-fns';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';
import path from 'path';
import { getPaginationOptions, formatPaginationResponse } from '../utils/controllerUtils';
import { generateFileUrl, deleteFile } from '../config/multer';

import db from '../models/index';
const { Service, ServiceCategory, ServiceImage, StaffService, Staff } = db;

export const getServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      isActive,
    } = req.query;
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    const { offset, limit: limitOption } = getPaginationOptions(Number(page), Number(limit));
    const { count, rows: services } = await Service.findAndCountAll({
      where,
      include: [
        {
          model: ServiceCategory,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: ServiceImage,
          as: 'images',
          attributes: ['id', 'imagePath']
        },
        {
          model: Staff,
          as: 'staffMembers',
          through: {
            model: StaffService,
            attributes: ['isActive']
          },
          attributes: ['id', 'fullName', 'isActive']
        }
      ],
      offset,
      limit: limitOption
    });
    const formattedServices = services.map(service => {
      const mainImage = service.images?.find(img => img.isMain)?.imagePath ||
        service.images?.[0]?.imagePath;
      return {
        id: service.id,
        slug: service.slug,
        title: service.title,
        description: service.description,
        price: service.price,
        image: mainImage,
        duration: service.duration,
        category: service.category,
        isActive: service.isActive,
        staffMembers: service.staffMembers?.filter(staff => staff.isActive)?.map(staff => ({
          id: staff.id,
          fullName: staff.fullName
        })) || []
      };
    });
    res.status(200).json(ApiSuccess.list(formattedServices, null, 'Hizmetler başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id, {
      include: [
        {
          model: ServiceCategory,
          as: 'category',
          attributes: ['id', 'name', 'description']
        },
        {
          model: ServiceImage,
          as: 'images',
          attributes: ['id', 'imagePath']
        },
        {
          model: Staff,
          as: 'staffMembers',
          through: {
            model: StaffService,
            attributes: ['isActive']
          },
          attributes: ['id', 'fullName', 'isActive']
        }
      ]
    });
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }

    // Staff bilgilerini formatla
    const formattedService = {
      ...service.toJSON(),
      staffMembers: service.staffMembers?.filter(staff => staff.isActive)?.map(staff => ({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        fullName: `${staff.firstName} ${staff.lastName}`
      })) || []
    };

    res.json(ApiSuccess.item(formattedService, 'Hizmet detayları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await Service.create(req.body);
    let staffIds: any = req.body.staffIds;
    let staffIdsCleaned: any = [];
    if(staffIds){
      const staffIdsString: any = staffIds;
      const staffIdsCleaned = await JSON.parse(staffIdsString);
    }
    // forEach yerine Promise.all kullanarak tüm staff-service ilişkilerini paralel olarak oluştur
    if (staffIdsCleaned && staffIdsCleaned.length > 0) {
      await Promise.all(
        staffIds.map(staffId =>
          StaffService.create({
            staffId: staffId,
            serviceId: service.id,
            isActive: true
          })
        )
      );
    }

    let avatarPath = null;
    if (req.file) {
      const fileName = req.file.filename;
      avatarPath = generateFileUrl(req, path.join('services', fileName));
    }
    await ServiceImage.create({
      serviceId: service.id,
      imagePath: avatarPath,
      isMain: true, // İlk resim ana resim olsun
      orderIndex: 0
    });

    // Oluşturulan hizmeti staff bilgileriyle birlikte getir
    const serviceWithStaff = await Service.findByPk(service.id, {
    include: [
      {
        model: ServiceCategory,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: ServiceImage,
        as: 'images',
        attributes: ['id', 'imagePath', 'isMain', 'orderIndex']
      },
      {
        model: Staff,
        as: 'staffMembers',
        through: {
          model: StaffService,
          attributes: ['isActive']
        },
        attributes: ['id', 'fullName']
      }
    ]
  });

  res.status(201).json(ApiSuccess.created(serviceWithStaff, 'Hizmet başarıyla oluşturuldu'));
} catch (error) {
  // Hata durumunda yüklenen dosyayı sil
  if (req.file) {
    await deleteFile(req.file.path);
  }
  next(error);
}
};

export const updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }

    await service.update(req.body);

    // Staff ilişkilerini güncelle
    const staffIds: number[] = req.body.staffIds;
    if (staffIds && Array.isArray(staffIds)) {
      // Önce mevcut ilişkileri sil
      await StaffService.destroy({
        where: { serviceId: id }
      });

      // Yeni ilişkileri oluştur
      if (staffIds.length > 0) {
        await Promise.all(
          staffIds.map(staffId =>
            StaffService.create({
              staffId: staffId,
              serviceId: id,
              isActive: true
            })
          )
        );
      }
    }

    // Güncellenmiş hizmeti staff bilgileriyle birlikte getir
    const updatedServiceWithStaff = await Service.findByPk(id, {
      include: [
        {
          model: ServiceCategory,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: Staff,
          as: 'staffMembers',
          through: {
            model: StaffService,
            attributes: ['isActive']
          },
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.status(200).json(ApiSuccess.updated(updatedServiceWithStaff, 'Hizmet başarıyla güncellendi'));
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }
    await service.destroy();
    res.status(200).json(ApiSuccess.deleted('Hizmet başarıyla silindi'));
  } catch (error) {
    next(error);
  }
};

export const getServiceCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, isActive, sortBy = 'orderIndex', sortOrder = 'asc' } = req.query;
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (isActive !== undefined) where.isActive = isActive === 'true';
    const { offset, limit: limitOption } = getPaginationOptions(Number(page), Number(limit));
    const { count, rows: categories } = await ServiceCategory.findAndCountAll({
      where,
      include: [
        {
          model: Service,
          as: 'services',
          attributes: ['id'],
          required: false
        }
      ],
      order: [[sortBy.toString(), sortOrder.toString().toUpperCase()]],
      offset,
      limit: limitOption
    });
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      imagePath: category.imagePath,
      orderIndex: category.orderIndex,
      isActive: category.isActive,
      serviceCount: category.services?.length || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));
    const pagination = formatPaginationResponse(count, Number(page), Number(limit));
    res.status(200).json(ApiSuccess.list(formattedCategories, pagination, 'Hizmet kategorileri başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createServiceCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, imagePath, orderIndex, isActive } = req.body;
    if (!name) {
      throw ApiError.badRequest('Kategori adı gereklidir');
    }
    const existingCategory = await ServiceCategory.findOne({
      where: { name: { [Op.iLike]: name } }
    });
    if (existingCategory) {
      throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
    }
    const category = await ServiceCategory.create({
      name,
      description,
      imagePath,
      orderIndex: orderIndex || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    res.status(201).json(ApiSuccess.created(category, 'Hizmet kategorisi başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
};

export const updateServiceCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, imagePath, orderIndex, isActive } = req.body;
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      throw ApiError.notFound('Hizmet kategorisi bulunamadı');
    }
    if (name && name !== category.name) {
      const existingCategory = await ServiceCategory.findOne({
        where: {
          name: { [Op.iLike]: name },
          id: { [Op.ne]: id }
        }
      });
      if (existingCategory) {
        throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
      }
    }
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      imagePath: imagePath !== undefined ? imagePath : category.imagePath,
      orderIndex: orderIndex !== undefined ? orderIndex : category.orderIndex,
      isActive: isActive !== undefined ? isActive : category.isActive
    });
    res.status(200).json(ApiSuccess.updated(category, 'Hizmet kategorisi başarıyla güncellendi'));
  } catch (error) {
    next(error);
  }
};

export const deleteServiceCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      throw ApiError.notFound('Hizmet kategorisi bulunamadı');
    }
    const serviceCount = await Service.count({
      where: { categoryId: id }
    });
    if (serviceCount > 0) {
      throw ApiError.badRequest('Bu kategoriye ait hizmetler bulunduğu için kategori silinemez');
    }
    await category.destroy();
    res.status(200).json(ApiSuccess.deleted('Hizmet kategorisi başarıyla silindi'));
  } catch (error) {
    next(error);
  }
};

export const getServiceStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Önce hizmetin var olup olmadığını kontrol et
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }

    // StaffService modeli üzerinden bu hizmeti verebilen personelleri getir
    const staffServices = await StaffService.findAll({
      where: {
        serviceId: id,
        isActive: true
      },
      include: [
        {
          model: Staff,
          as: 'staff',
          where: { isActive: true },
          attributes: ['id', 'fullName', 'specialties', 'avatar']
        }
      ],
      order: [[{ model: Staff, as: 'staff' }, 'fullName', 'ASC']]
    });

    // İş saatlerini getir
    const businessHours = await db.BusinessHours.findAll({
      order: [['dayOfWeek', 'ASC']]
    });

    // Bugünden başlayarak bir haftalık tarih aralığını oluştur
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6); // Bugün + 6 gün = 1 hafta
    
    const dates = eachDayOfInterval({ 
      start: startDate, 
      end: endDate 
    });

    // Tüm personellerin müsaitlik durumlarını paralel olarak hesapla
    const formattedStaffWithAvailability = await Promise.all(staffServices.map(async staffService => {
      const staffId = staffService.staff.id;
      
      // Bu tarih aralığındaki personelin müsaitlik kayıtlarını getir
      const staffAvailabilityRecords = await db.StaffAvailability.findAll({
        where: {
          staffId,
          date: {
            [Op.between]: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
          }
        }
      });

      // Bu tarih aralığındaki personelin randevularını getir
      const appointments = await db.Appointment.findAll({
        where: {
          staffId,
          appointmentDate: {
            [Op.between]: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
          }
        },
        attributes: ['appointmentDate', 'startTime', 'endTime', 'id', 'serviceId']
      });

      // Her gün için müsaitlik durumunu hesapla
      const dailyAvailability = dates.map(date => {
        // Geçerli bir tarih olduğundan emin ol
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          return {
            date: "Geçersiz tarih",
            dayOfWeek: 0,
            isAvailable: false,
            reason: "Geçersiz tarih",
            availableSlots: [],
            totalSlots: 0,
            workingHours: null
          };
        }

        const dateStr = format(date, 'yyyy-MM-dd');
        const dayOfWeek = date.getDay() || 7;

        // O tarih için özel müsaitlik kaydı var mı?
        const staffAvailability = staffAvailabilityRecords.find(sa => sa.date === dateStr);

        // İş saatleri
        const businessHour = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);

        // O gün randevuları
        const dayAppointments = appointments.filter(apt => apt.appointmentDate === dateStr);

        let workingHours;
        let isAvailable = true;
        let reason = null;

        // Çalışma saatlerini belirle
        if (staffAvailability) {
          if (!staffAvailability.isAvailable) {
            isAvailable = false;
            reason = staffAvailability.notes || 'Personel bu tarihte müsait değil';
          } else {
            workingHours = {
              start: staffAvailability.startTime,
              end: staffAvailability.endTime,
              lunchBreak: staffAvailability.lunchBreakStart && staffAvailability.lunchBreakEnd ? {
                start: staffAvailability.lunchBreakStart,
                end: staffAvailability.lunchBreakEnd
              } : null
            };
          }
        } else if (businessHour && !businessHour.isClosed) {
          workingHours = {
            start: businessHour.openTime,
            end: businessHour.closeTime,
            lunchBreak: {
              start: '12:00:00',
              end: '13:00:00'
            }
          };
        } else {
          // İş saatleri yoksa ve özel müsaitlik kaydı yoksa varsayılan saatler belirle
          // Pazar (0) ve Cumartesi (6) günleri için farklı saatler belirle
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          if (isWeekend) {
            workingHours = {
              start: '10:00:00',
              end: '16:00:00',
              lunchBreak: {
                start: '13:00:00',
                end: '14:00:00'
              }
            };
          } else {
            workingHours = {
              start: '09:00:00',
              end: '18:00:00',
              lunchBreak: {
                start: '12:00:00',
                end: '13:00:00'
              }
            };
          }
          
          isAvailable = true;
          reason = null;
        }

        let availableSlots = [];

        // Eğer müsaitse ve çalışma saatleri tanımlanmışsa slot'ları oluştur
        if (isAvailable && workingHours) {
          // 30 dakika aralıklarla slot'ları oluştur
          const startHour = parseInt(workingHours.start.split(':')[0]);
          const startMinute = parseInt(workingHours.start.split(':')[1]);
          const endHour = parseInt(workingHours.end.split(':')[0]);
          const endMinute = parseInt(workingHours.end.split(':')[1]);

          const allSlots: string[] = [];
          let currentHour = startHour;
          let currentMinute = startMinute;

          while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            allSlots.push(timeStr);

            currentMinute += 30;
            if (currentMinute >= 60) {
              currentMinute = 0;
              currentHour += 1;
            }
          }

          // Kullanılamayan saatleri filtrele
          availableSlots = allSlots.filter(slot => {
            // Öğle molasını kontrol et
            if (workingHours.lunchBreak) {
              const lunchStart = workingHours.lunchBreak.start.substring(0, 5);
              const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
              if (slot >= lunchStart && slot < lunchEnd) {
                return false;
              }
            }

            // Mevcut randevularla çakışma kontrolü
            return !dayAppointments.some(appointment => {
              const appointmentStart = appointment.startTime.substring(0, 5);
              const appointmentEnd = appointment.endTime.substring(0, 5);
              return slot >= appointmentStart && slot < appointmentEnd;
            });
          }).map(slot => ({
            time: slot,
            displayTime: slot,
            available: true
          }));
          
          // Eğer hala slot yoksa, bugün için geçmiş saatleri kontrol et
          if (availableSlots.length === 0) {
            const today = new Date();
            const isToday = date.getDate() === today.getDate() && 
                           date.getMonth() === today.getMonth() && 
                           date.getFullYear() === today.getFullYear();
                            
            if (isToday) {
              // Bugün için sadece gelecek saatleri göster
              const currentHour = today.getHours();
              const currentMinute = today.getMinutes();
              
              // Varsayılan slotları oluştur (şu andan itibaren)
              const defaultSlots = [];
              let hour = currentHour;
              let minute = Math.ceil(currentMinute / 30) * 30; // En yakın 30 dakikaya yuvarla
              
              if (minute >= 60) {
                minute = 0;
                hour += 1;
              }
              
              while (hour < endHour || (hour === endHour && minute < endMinute)) {
                const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                // Öğle molası kontrolü
                let isLunchBreak = false;
                if (workingHours.lunchBreak) {
                  const lunchStart = workingHours.lunchBreak.start.substring(0, 5);
                  const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
                  if (timeStr >= lunchStart && timeStr < lunchEnd) {
                    isLunchBreak = true;
                  }
                }
                
                // Randevu çakışması kontrolü
                const hasAppointment = dayAppointments.some(appointment => {
                  const appointmentStart = appointment.startTime.substring(0, 5);
                  const appointmentEnd = appointment.endTime.substring(0, 5);
                  return timeStr >= appointmentStart && timeStr < appointmentEnd;
                });
                
                if (!isLunchBreak && !hasAppointment) {
                  defaultSlots.push({
                    time: timeStr,
                    displayTime: timeStr,
                    available: true
                  });
                }
                
                minute += 30;
                if (minute >= 60) {
                  minute = 0;
                  hour += 1;
                }
              }
              
              availableSlots = defaultSlots;
            } else {
              // Bugün değilse, varsayılan slotları oluştur
              const defaultSlots = [];
              let hour = startHour;
              let minute = startMinute;
              
              while (hour < endHour || (hour === endHour && minute < endMinute)) {
                const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                // Öğle molası kontrolü
                let isLunchBreak = false;
                if (workingHours.lunchBreak) {
                  const lunchStart = workingHours.lunchBreak.start.substring(0, 5);
                  const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
                  if (timeStr >= lunchStart && timeStr < lunchEnd) {
                    isLunchBreak = true;
                  }
                }
                
                if (!isLunchBreak) {
                  defaultSlots.push({
                    time: timeStr,
                    displayTime: timeStr,
                    available: true
                  });
                }
                
                minute += 30;
                if (minute >= 60) {
                  minute = 0;
                  hour += 1;
                }
              }
              
              availableSlots = defaultSlots;
            }
          }
        }

        return {
          date: dateStr,
          dayOfWeek,
          isAvailable,
          reason,
          availableSlots,
          totalSlots: availableSlots.length,
          workingHours: workingHours ? {
            start: workingHours.start.substring(0, 5),
            end: workingHours.end.substring(0, 5),
            lunchBreak: workingHours.lunchBreak ?
              `${workingHours.lunchBreak.start.substring(0, 5)} - ${workingHours.lunchBreak.end.substring(0, 5)}` :
              null
          } : null
        };
      });

      // Toplam müsait slot sayısını hesapla
      const totalAvailableSlots = dailyAvailability.reduce((total, day) => total + day.totalSlots, 0);
      const availableDays = dailyAvailability.filter(day => day.isAvailable && day.totalSlots > 0).length;

      return {
      id: staffService.staff.id,
      fullName: staffService.staff.fullName,
      specialties: staffService.staff.specialties,
      avatar: staffService.staff.avatar,
        canProvideService: staffService.isActive,
        availability: {
          summary: {
            totalDays: dailyAvailability.length,
            availableDays,
            totalAvailableSlots,
            averageSlotsPerDay: availableDays > 0 ? Math.round(totalAvailableSlots / availableDays) : 0
          },
          dailyAvailability
        }
      };
    }));

    res.json(ApiSuccess.list(formattedStaffWithAvailability, null, 'Hizmeti veren personeller ve müsaitlik durumları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getServiceStaffAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    let startDateStr = req.query.startDate as string;
    let endDateStr = req.query.endDate as string;

    // Tarih parametreleri belirtilmemişse varsayılan değerler ata
    if (!startDateStr) {
      const today = new Date();
      startDateStr = format(today, 'yyyy-MM-dd');
    }

    if (!endDateStr) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 6); // Bugün + 6 gün = 1 hafta
      endDateStr = format(endDate, 'yyyy-MM-dd');
    }

    // Önce hizmetin var olup olmadığını kontrol et
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }

    // Bu hizmeti verebilen aktif personelleri getir
    const staffServices = await StaffService.findAll({
      where: {
        serviceId: id,
        isActive: true
      },
      include: [
        {
          model: Staff,
          as: 'staff',
          where: { isActive: true },
          attributes: ['id', 'fullName', 'specialties', 'avatar']
        }
      ],
      order: [[{ model: Staff, as: 'staff' }, 'fullName', 'ASC']]
    });

    if (staffServices.length === 0) {
      res.json(ApiSuccess.list([], null, 'Bu hizmeti verebilen aktif personel bulunamadı'));
      return;
    }

    // İş saatlerini getir
    const businessHours = await db.BusinessHours.findAll({
      order: [['dayOfWeek', 'ASC']]
    });

    // Tarih aralığındaki günleri oluştur
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Tarihlerin geçerli olduğundan emin ol
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw ApiError.badRequest('Geçersiz tarih formatı. Lütfen YYYY-MM-DD formatında tarih girin.');
    }
    
    const dates = eachDayOfInterval({ 
      start: startDate, 
      end: endDate 
    });

    // Tüm personellerin müsaitlik durumlarını paralel olarak hesapla
    const staffAvailabilities = await Promise.all(staffServices.map(async (staffService) => {
      const staffId = staffService.staff.id;

      // Bu tarih aralığındaki personelin müsaitlik kayıtlarını getir
      const staffAvailabilityRecords = await db.StaffAvailability.findAll({
        where: {
          staffId,
          date: {
            [Op.between]: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
          }
        }
      });

      // Bu tarih aralığındaki personelin randevularını getir
      const appointments = await db.Appointment.findAll({
        where: {
          staffId,
          appointmentDate: {
            [Op.between]: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
          }
        },
        attributes: ['appointmentDate', 'startTime', 'endTime', 'id', 'serviceId']
      });

      // Her gün için müsaitlik durumunu hesapla
      const dailyAvailability = dates.map(date => {
        // Geçerli bir tarih olduğundan emin ol
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          return {
            date: "Geçersiz tarih",
            dayOfWeek: 0,
            isAvailable: false,
            reason: "Geçersiz tarih",
            availableSlots: [],
            totalSlots: 0,
            workingHours: null
          };
        }
        
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayOfWeek = date.getDay() || 7;

        // O tarih için özel müsaitlik kaydı var mı?
        const staffAvailability = staffAvailabilityRecords.find(sa => sa.date === dateStr);

        // İş saatleri
        const businessHour = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);

        // O gün randevuları
        const dayAppointments = appointments.filter(apt => apt.appointmentDate === dateStr);

        let workingHours;
        let isAvailable = true;
        let reason = null;

        if (staffAvailability) {
          if (!staffAvailability.isAvailable) {
            isAvailable = false;
            reason = staffAvailability.notes || 'Personel bu tarihte müsait değil';
          } else {
            workingHours = {
              start: staffAvailability.startTime,
              end: staffAvailability.endTime,
              lunchBreak: staffAvailability.lunchBreakStart && staffAvailability.lunchBreakEnd ? {
                start: staffAvailability.lunchBreakStart,
                end: staffAvailability.lunchBreakEnd
              } : null
            };
          }
        } else if (businessHour && !businessHour.isClosed) {
          workingHours = {
            start: businessHour.openTime,
            end: businessHour.closeTime,
            lunchBreak: {
              start: '12:00:00',
              end: '13:00:00'
            }
          };
        } else {
          // İş saatleri yoksa ve özel müsaitlik kaydı yoksa varsayılan saatler belirle
          // Pazar (0) ve Cumartesi (6) günleri için farklı saatler belirle
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          if (isWeekend) {
            workingHours = {
              start: '10:00:00',
              end: '16:00:00',
              lunchBreak: {
                start: '13:00:00',
                end: '14:00:00'
              }
            };
          } else {
            workingHours = {
              start: '09:00:00',
              end: '18:00:00',
              lunchBreak: {
                start: '12:00:00',
                end: '13:00:00'
              }
            };
          }
          
          isAvailable = true;
          reason = null;
        }

        let availableSlots = [];

        if (isAvailable && workingHours) {
          // 30 dakika aralıklarla slot'ları oluştur
          const startHour = parseInt(workingHours.start.split(':')[0]);
          const startMinute = parseInt(workingHours.start.split(':')[1]);
          const endHour = parseInt(workingHours.end.split(':')[0]);
          const endMinute = parseInt(workingHours.end.split(':')[1]);

          const allSlots: string[] = [];
          let currentHour = startHour;
          let currentMinute = startMinute;

          while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            allSlots.push(timeStr);

            currentMinute += 30;
            if (currentMinute >= 60) {
              currentMinute = 0;
              currentHour += 1;
            }
          }

          // Kullanılamayan saatleri filtrele
          availableSlots = allSlots.filter(slot => {
            // Öğle molasını kontrol et
            if (workingHours.lunchBreak) {
              const lunchStart = workingHours.lunchBreak.start.substring(0, 5);
              const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
              if (slot >= lunchStart && slot < lunchEnd) {
                return false;
              }
            }

            // Mevcut randevularla çakışma kontrolü
            return !dayAppointments.some(appointment => {
              const appointmentStart = appointment.startTime.substring(0, 5);
              const appointmentEnd = appointment.endTime.substring(0, 5);
              return slot >= appointmentStart && slot < appointmentEnd;
            });
          }).map(slot => ({
            time: slot,
            displayTime: slot,
            available: true
          }));
          
          // Eğer hala slot yoksa, bugün için geçmiş saatleri kontrol et
          if (availableSlots.length === 0) {
            const today = new Date();
            const isToday = date.getDate() === today.getDate() && 
                            date.getMonth() === today.getMonth() && 
                            date.getFullYear() === today.getFullYear();
                            
            if (isToday) {
              // Bugün için sadece gelecek saatleri göster
              const currentHour = today.getHours();
              const currentMinute = today.getMinutes();
              
              // Varsayılan slotları oluştur (şu andan itibaren)
              const defaultSlots = [];
              let hour = currentHour;
              let minute = Math.ceil(currentMinute / 30) * 30; // En yakın 30 dakikaya yuvarla
              
              if (minute >= 60) {
                minute = 0;
                hour += 1;
              }
              
              while (hour < endHour || (hour === endHour && minute < endMinute)) {
                const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                // Öğle molası kontrolü
                let isLunchBreak = false;
                if (workingHours.lunchBreak) {
                  const lunchStart = workingHours.lunchBreak.start.substring(0, 5);
                  const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
                  if (timeStr >= lunchStart && timeStr < lunchEnd) {
                    isLunchBreak = true;
                  }
                }
                
                // Randevu çakışması kontrolü
                const hasAppointment = dayAppointments.some(appointment => {
                  const appointmentStart = appointment.startTime.substring(0, 5);
                  const appointmentEnd = appointment.endTime.substring(0, 5);
                  return timeStr >= appointmentStart && timeStr < appointmentEnd;
                });
                
                if (!isLunchBreak && !hasAppointment) {
                  defaultSlots.push({
                    time: timeStr,
                    displayTime: timeStr,
                    available: true
                  });
                }
                
                minute += 30;
                if (minute >= 60) {
                  minute = 0;
                  hour += 1;
                }
              }
              
              availableSlots = defaultSlots;
            } else {
              // Bugün değilse, varsayılan slotları oluştur
              const defaultSlots = [];
              let hour = startHour;
              let minute = startMinute;
              
              while (hour < endHour || (hour === endHour && minute < endMinute)) {
                const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                
                // Öğle molası kontrolü
                let isLunchBreak = false;
                if (workingHours.lunchBreak) {
                  const lunchStart = workingHours.lunchBreak.start.substring(0, 5);
                  const lunchEnd = workingHours.lunchBreak.end.substring(0, 5);
                  if (timeStr >= lunchStart && timeStr < lunchEnd) {
                    isLunchBreak = true;
                  }
                }
                
                if (!isLunchBreak) {
                  defaultSlots.push({
                    time: timeStr,
                    displayTime: timeStr,
                    available: true
                  });
                }
                
                minute += 30;
                if (minute >= 60) {
                  minute = 0;
                  hour += 1;
                }
              }
              
              availableSlots = defaultSlots;
            }
          }
        }

        return {
          date: dateStr,
          dayOfWeek,
          isAvailable,
          reason,
          availableSlots,
          totalSlots: availableSlots.length,
          workingHours: workingHours ? {
            start: workingHours.start.substring(0, 5),
            end: workingHours.end.substring(0, 5),
            lunchBreak: workingHours.lunchBreak ?
              `${workingHours.lunchBreak.start.substring(0, 5)} - ${workingHours.lunchBreak.end.substring(0, 5)}` :
              null
          } : null
        };
      });

      // Toplam müsait slot sayısını hesapla
      const totalAvailableSlots = dailyAvailability.reduce((total, day) => total + day.totalSlots, 0);
      const availableDays = dailyAvailability.filter(day => day.isAvailable && day.totalSlots > 0).length;

      return {
        staff: {
          id: staffService.staff.id,
          fullName: staffService.staff.fullName,
          specialties: staffService.staff.specialties,
          avatar: staffService.staff.avatar
        },
        summary: {
          totalDays: dailyAvailability.length,
          availableDays,
          totalAvailableSlots,
          averageSlotsPerDay: availableDays > 0 ? Math.round(totalAvailableSlots / availableDays) : 0
        },
        dailyAvailability
      };
    }));

    // En müsait personeli en üste getir
    // Önce her personelin summary özelliğini kontrol et
    const validStaffAvailabilities = staffAvailabilities.filter(item => item && item.summary);
    
    // Eğer geçerli personeller varsa sırala
    if (validStaffAvailabilities.length > 0) {
      validStaffAvailabilities.sort((a, b) => b.summary.totalAvailableSlots - a.summary.totalAvailableSlots);
    }

    const response = {
      service: {
        id: service.id,
        title: service.title,
        duration: service.duration,
        price: service.price
      },
      dateRange: {
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        totalDays: dates.length
      },
      staffAvailabilities: validStaffAvailabilities
    };

    res.json(ApiSuccess.item(response, 'Hizmet personellerinin müsaitlik durumları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
}; 