export interface Appointment {
    id: number;
    customerId: number;
    staffId: number;
    serviceId: number;
    statusId: number;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
}

export interface AppointmentStatus {
    id: number;
    displayName: string;
    color: string;
}

// Minimal types for compatibility
export interface Service {
    id: number;
    title: string;
    price: string;
    duration: string;
}

export interface Staff {
    id: number;
    fullName: string;
    specialties: string;
    email: string;
    phone: string;
    isActive: boolean;
}

export interface AppointmentFilter {
    startDate?: string;
    endDate?: string;
    customerId?: number;
    serviceId?: number;
    staffId?: number;
    statusId?: number;
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
}

