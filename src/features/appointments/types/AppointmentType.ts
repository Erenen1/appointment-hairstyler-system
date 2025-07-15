export type Appointment = {
    id: number
    customerId: number
    staffId: number
    serviceId: number
    statusId: number
    status: 'onaylandı' | 'bekliyor' | 'iptal'
    appointmentDate: string
    appointmentTime: string
    // endTime: string
    notes: string
    price: number
    createdByAdmin: number | null
    createdAt: string
    updatedAt: string
}

export interface AppointmentHeaderProps {
    onSearch: (query: string) => void;
}