import { UUID, DateString, TimeString, Status, Auditable } from '../common';

export interface Admin extends Auditable {
  id: UUID;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'super_admin';
  status: Status;
}

export interface Staff extends Auditable {
  id: UUID;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio?: string;
  avatar?: string;
  status: Status;
  services?: UUID[];
}

export interface Customer extends Auditable {
  id: UUID;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate?: DateString;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  status: Status;
}

export interface Service extends Auditable {
  id: UUID;
  name: string;
  description?: string;
  duration: number;
  price: number;
  categoryId: UUID;
  status: Status;
  image?: string;
}

export interface ServiceCategory extends Auditable {
  id: UUID;
  name: string;
  description?: string;
  status: Status;
}

export interface Appointment extends Auditable {
  id: UUID;
  customerId: UUID;
  staffId: UUID;
  serviceId: UUID;
  date: DateString;
  startTime: TimeString;
  endTime: TimeString;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface AppointmentHistory extends Auditable {
  id: UUID;
  appointmentId: UUID;
  status: string;
  notes?: string;
  changedBy: UUID;
}

export interface BusinessHours {
  id: UUID;
  dayOfWeek: number;
  startTime: TimeString;
  endTime: TimeString;
  isOpen: boolean;
}

export interface SpecialDays extends Auditable {
  id: UUID;
  date: DateString;
  startTime?: TimeString;
  endTime?: TimeString;
  isOpen: boolean;
  description?: string;
}

export interface ContactMessage extends Auditable {
  id: UUID;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
}

export interface EmailTemplate extends Auditable {
  id: UUID;
  name: string;
  subject: string;
  content: string;
  type: string;
  status: Status;
}

export interface SmsTemplate extends Auditable {
  id: UUID;
  name: string;
  content: string;
  type: string;
  status: Status;
}

export interface GalleryCategory extends Auditable {
  id: UUID;
  name: string;
  description?: string;
  status: Status;
}

export interface GalleryImage extends Auditable {
  id: UUID;
  categoryId: UUID;
  title?: string;
  description?: string;
  url: string;
  status: Status;
} 