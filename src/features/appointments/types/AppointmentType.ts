export type Appointment = {
    id: number
    customerId: number
    staffId: number
    serviceId: number
    startTime: string
    endTime: string
    notes: string
    price: number
    createdAt: string
    updatedAt: string
}

export interface AppointmentHeaderProps {
    onSearch: (query: string) => void;
}
export interface AppointmentUpdateModalProps {
    children: React.ReactNode;
    selectedAppointment: Appointment;
}