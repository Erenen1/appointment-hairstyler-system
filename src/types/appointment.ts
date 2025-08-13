export interface Appointment {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    duration: number; // minutes
    status: AppointmentStatus;
    priority: AppointmentPriority;
    type: AppointmentType;

    // Relations
    clientId: string;
    agentId: string;
    propertyId?: string;

    // Location
    location?: string;
    isVirtual: boolean;
    meetingLink?: string;

    // Notes
    notes?: string;
    internalNotes?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    cancelledAt?: Date;
}

export type AppointmentStatus =
    | 'scheduled'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show'
    | 'rescheduled';

export type AppointmentPriority = 'low' | 'medium' | 'high' | 'urgent';

export type AppointmentType =
    | 'property_viewing'
    | 'consultation'
    | 'contract_signing'
    | 'inspection'
    | 'maintenance'
    | 'other';

export interface AppointmentReminder {
    id: string;
    appointmentId: string;
    type: 'email' | 'sms' | 'push';
    sendAt: Date;
    isSent: boolean;
    sentAt?: Date;
    createdAt: Date;
}

export interface AppointmentConflict {
    appointmentId: string;
    conflictingAppointmentId: string;
    conflictType: 'time_overlap' | 'agent_unavailable' | 'property_unavailable';
    severity: 'warning' | 'error';
    createdAt: Date;
}
