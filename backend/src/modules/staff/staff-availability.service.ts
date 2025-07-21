import { Op } from 'sequelize';
import db from '../../models';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilityParams {
  staffId: string;
  date: string;
  serviceId?: string;
}

interface CreateAvailabilityParams {
  staffId: string;
  startDate: string;
  endDate: string;
  weekDays?: number[]; // 1-7 arası, 1=Pazartesi
}

export class StaffAvailabilityService {
  private StaffAvailability = db.StaffAvailability;
  private BusinessHours = db.BusinessHours;
  private SpecialDays = db.SpecialDays;
  private Appointment = db.Appointment;
  private Service = db.Service;

  /**
   * Belirli bir personelin belirli bir tarihteki müsait saatlerini getirir
   */
  async getAvailableTimeSlots(params: AvailabilityParams): Promise<TimeSlot[]> {
    const { staffId, date, serviceId } = params;
    
    // 1. Personelin o günkü müsaitlik kaydını getir
    const availability = await this.StaffAvailability.findOne({
      where: {
        staffId,
        date,
        isAvailable: true
      }
    });

    if (!availability) {
      return [];
    }

    // 2. Hizmet süresini al (eğer belirtilmişse)
    let serviceDuration = 30; // varsayılan 30 dakika
    if (serviceId) {
      const service = await this.Service.findByPk(serviceId);
      if (service && service.duration) {
        serviceDuration = service.duration;
      }
    }

    // 3. O günkü mevcut randevuları getir
    const existingAppointments = await this.Appointment.findAll({
      where: {
        staffId,
        appointmentDate: date
      },
      order: [['startTime', 'ASC']]
    });

    // 4. Müsait zaman dilimlerini hesapla
    return this.calculateAvailableSlots(
      availability,
      existingAppointments,
      serviceDuration
    );
  }

  /**
   * Müsait zaman dilimlerini hesaplar
   */
  private calculateAvailableSlots(
    availability: any,
    appointments: any[],
    serviceDuration: number
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const slotDuration = 15; // 15 dakikalık slotlar
    
    // Çalışma saatlerini dakikaya çevir
    const workStart = this.timeToMinutes(availability.startTime);
    const workEnd = this.timeToMinutes(availability.endTime);
    
    // Öğle molasını al
    const lunchStart = availability.lunchBreakStart ? 
      this.timeToMinutes(availability.lunchBreakStart) : null;
    const lunchEnd = availability.lunchBreakEnd ? 
      this.timeToMinutes(availability.lunchBreakEnd) : null;

    // Mevcut randevuları dakikaya çevir
    const bookedSlots = appointments.map(app => ({
      start: this.timeToMinutes(app.startTime),
      end: this.timeToMinutes(app.endTime)
    }));

    // Her 15 dakikalık dilimi kontrol et
    for (let time = workStart; time <= workEnd - serviceDuration; time += slotDuration) {
      const slotEnd = time + serviceDuration;
      
      // Öğle molası ile çakışma kontrolü
      if (lunchStart && lunchEnd) {
        if (time < lunchEnd && slotEnd > lunchStart) {
          continue;
        }
      }
      
      // Mevcut randevu ile çakışma kontrolü
      const hasConflict = bookedSlots.some(booking => 
        time < booking.end && slotEnd > booking.start
      );
      
      if (!hasConflict) {
        slots.push({
          startTime: this.minutesToTime(time),
          endTime: this.minutesToTime(slotEnd)
        });
      }
    }

    return slots;
  }

  /**
   * Otomatik müsaitlik kayıtları oluşturur
   */
  async createAutoAvailability(params: CreateAvailabilityParams): Promise<void> {
    const { staffId, startDate, endDate, weekDays = [1, 2, 3, 4, 5, 6] } = params;
    
    // İş saatlerini getir
    const businessHours = await this.BusinessHours.findAll({
      where: {
        dayOfWeek: {
          [Op.in]: weekDays
        },
        isClosed: false
      }
    });

    // Özel günleri getir
    const specialDays = await this.SpecialDays.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    const start = new Date(startDate);
    const end = new Date(endDate);
    const availabilityRecords = [];

    // Her gün için müsaitlik kaydı oluştur
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Pazar=7
      const dateStr = date.toISOString().split('T')[0];
      
      // Hafta içi günler kontrolü
      if (!weekDays.includes(dayOfWeek)) {
        continue;
      }

      // Özel gün kontrolü
      const specialDay = specialDays.find(sd => sd.date === dateStr);
      if (specialDay && specialDay.isClosed) {
        continue;
      }

      // İş saatlerini bul
      const businessHour = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
      if (!businessHour) {
        continue;
      }

      // Müsaitlik kaydı oluştur
      const availabilityData = {
        staffId,
        date: dateStr,
        dayOfWeek,
        startTime: specialDay?.openTime || businessHour.openTime,
        endTime: specialDay?.closeTime || businessHour.closeTime,
        lunchBreakStart: '12:00:00',
        lunchBreakEnd: '13:00:00',
        isAvailable: true,
        type: 'default'
      };

      availabilityRecords.push(availabilityData);
    }

    // Toplu kayıt oluştur
    if (availabilityRecords.length > 0) {
      await this.StaffAvailability.bulkCreate(availabilityRecords, {
        ignoreDuplicates: true
      });
    }
  }

  /**
   * Belirli tarih aralığındaki tüm personellerin müsaitliklerini getirir
   */
  async getStaffAvailabilityByDateRange(
    startDate: string, 
    endDate: string
  ): Promise<any[]> {
    return await this.StaffAvailability.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate]
        },
        isAvailable: true
      },
      include: [
        {
          model: db.Staff,
          as: 'staff',
          attributes: ['id', 'firstName', 'lastName', 'phone']
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });
  }

  /**
   * Personelin özel izin/müsaitlik güncellemesi
   */
  async updateStaffAvailability(
    staffId: string,
    date: string,
    updates: Partial<{
      isAvailable: boolean;
      startTime: string;
      endTime: string;
      lunchBreakStart: string;
      lunchBreakEnd: string;
      type: 'default' | 'custom' | 'off';
      notes: string;
    }>
  ): Promise<any> {
    const [updatedRows] = await this.StaffAvailability.update(updates, {
      where: { staffId, date }
    });

    if (updatedRows === 0) {
      // Kayıt yoksa oluştur
      return await this.StaffAvailability.create({
        staffId,
        date,
        dayOfWeek: new Date(date).getDay() === 0 ? 7 : new Date(date).getDay(),
        ...updates
      });
    }

    return await this.StaffAvailability.findOne({
      where: { staffId, date }
    });
  }

  // Yardımcı metodlar
  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
} 