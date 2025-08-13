export interface Appointment {
    id: number;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    customerId: number;
    serviceId: number;
    staffId: number;
    statusId: number;
    appointmentTypeId: number; // Randevu türü
    customerPhone: string; // Müşteri telefon numarası
    message?: string; // Mesaj/notlar
    notes?: string;
    duration: number;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface AppointmentType {
    id: number;
    name: string;
    displayName: string;
    description: string;
    color: string;
    icon: string;
}

export interface AppointmentStatus {
    id: number;
    name: string;
    displayName: string;
    color: string;
    description?: string;
}

export interface AppointmentFilter {
    startDate?: string;
    endDate?: string;
    customerId?: number;
    serviceId?: number;
    staffId?: number;
    statusId?: number;
    appointmentTypeId?: number; // Randevu türü filtresi
    timeSlot?: string;
}

export interface AppointmentStats {
    totalAppointments: number;
    todayAppointments: number;
    thisWeekAppointments: number;
    thisMonthAppointments: number;
    statusBreakdown: Array<{
        status: string;
        count: number;
        percentage: number;
    }>;
    serviceBreakdown: Array<{
        service: string;
        count: number;
        revenue: number;
    }>;
    staffBreakdown: Array<{
        staff: string;
        count: number;
        percentage: number;
    }>;
    typeBreakdown: Array<{
        type: string;
        count: number;
        percentage: number;
    }>;
}

