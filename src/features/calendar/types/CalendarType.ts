import { Staff } from '@/features/staff/types/StaffType';
import { ReactNode } from 'react';

export type AppointmentStatus = "confirmed" | "pending" | "completed";

type Appointment = {
    staffId: string;
    time: string;
    customer: string;
    service: string;
    phone: string;
    status: AppointmentStatus;
};

export const statusColors: Record<AppointmentStatus, string> = {
    confirmed: "bg-green-500",
    pending: "bg-yellow-400",
    completed: "bg-gray-400",
};

export type Props = {
    staffData: Staff[];
    timeSlots: string[];
    appointments: Appointment[];
    phone: string;
    onCellClick: (staffId: string, time: string) => void;
    onDeleteAppointment?: (staffId: string, time: string) => void;
};

export type CalendarModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
    title?: string;
};
