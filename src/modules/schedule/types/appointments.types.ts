export interface AppointmentListQuery {
  startDate?: string;
  endDate?: string;
  customerId?: string;
  serviceId?: string;
  staffId?: string;
  statusId?: string;
  timeSlot?: string;
  page?: number;
  pageSize?: number;
  sort?: string; // appointmentDate|-appointmentDate
}

export interface CreateAppointmentDTO {
  customerId: string;
  staffId: string;
  serviceId: string;
  statusId: string;
  appointmentDate: string; // yyyy-mm-dd
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  notes?: string;
  price?: number;
}

export type UpdateAppointmentDTO = Partial<CreateAppointmentDTO>;


