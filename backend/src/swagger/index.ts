import { commonSchemas, commonResponses } from './schemas/common';
import { healthSchemas } from './schemas/health';
import { authSchemas } from './schemas/auth';
import { adminSchemas } from './schemas/admin';
import { appointmentSchemas } from './schemas/appointment';
import { serviceSchemas } from './schemas/service';
import { customerSchemas } from './schemas/customer';
import { staffSchemas } from './schemas/staff';
import { contentSchemas } from './schemas/content';
import { contactSchemas } from './schemas/contact';
import { dashboardSchemas } from './schemas/dashboard';
import { 
  StaffAvailabilitySchema,
  CreateAvailabilitySchema,
  UpdateAvailabilitySchema,
  BulkCreateAvailabilitySchema,
  StaffAvailabilityWithAppointmentsSchema,
  AllStaffAvailabilityResponseSchema
} from './schemas/availability';

import { healthPaths } from './paths/health';
import { authPaths } from './paths/auth';
import { adminPaths } from './paths/admin';
import { appointmentPaths } from './paths/appointment';
import { servicePaths } from './paths/service';
import { customerPaths } from './paths/customer';
import { staffPaths } from './paths/staff';
import { contentPaths } from './paths/content';
import { contactPaths } from './paths/contact';
import { dashboardPaths } from './paths/dashboard';
import {
  getAllStaffAvailability,
  getStaffAvailability,
  createAvailability,
  bulkCreateAvailability,
  updateAvailability,
  deleteAvailability
} from './paths/availability';

const availabilitySchemas = {
  StaffAvailability: StaffAvailabilitySchema,
  CreateAvailability: CreateAvailabilitySchema,
  UpdateAvailability: UpdateAvailabilitySchema,
  BulkCreateAvailability: BulkCreateAvailabilitySchema,
  StaffAvailabilityWithAppointments: StaffAvailabilityWithAppointmentsSchema,
  AllStaffAvailabilityResponse: AllStaffAvailabilityResponseSchema
};

const availabilityPaths = {
  '/availability/all': getAllStaffAvailability,
  '/availability': {
    ...getStaffAvailability,
    ...createAvailability
  },
  '/availability/bulk': bulkCreateAvailability,
  '/availability/{id}': {
    ...updateAvailability,
    ...deleteAvailability
  }
};

// Tüm şemalar
export const allSchemas = {
  ...commonSchemas,
  ...healthSchemas,
  ...authSchemas,
  ...adminSchemas,
  ...appointmentSchemas,
  ...serviceSchemas,
  ...customerSchemas,
  ...staffSchemas,
  ...contentSchemas,
  ...contactSchemas,
  ...dashboardSchemas,
  ...availabilitySchemas
};

// Tüm path'ler
export const allPaths = {
  ...healthPaths,
  ...authPaths,
  ...adminPaths,
  ...appointmentPaths,
  ...servicePaths,
  ...customerPaths,
  ...staffPaths,
  ...contentPaths,
  ...contactPaths,
  ...dashboardPaths,
  ...availabilityPaths
};

// PUBLIC API için path'ler (Anasayfa kullanımı için)
export const publicPaths = {
  ...healthPaths,
  // Sadece services GET işlemleri
  '/services': {
    get: servicePaths['/services']?.get
  },
  '/services/{id}': {
    get: servicePaths['/services/{id}']?.get
  },
  '/services/{id}/staff-availability': servicePaths['/services/{id}/staff-availability'],
  // Sadece staff GET işlemleri
  '/staff': {
    get: staffPaths['/staff']?.get
  },
  '/staff/{id}': {
    get: staffPaths['/staff/{id}']?.get
  },
  '/staff/{id}/available-slots': staffPaths['/staff/{id}/available-slots'],
  '/staff/{id}/available-slots-range': staffPaths['/staff/{id}/available-slots-range'],
  // Contact işlemleri (sadece POST)
  '/contact': {
    post: contactPaths['/contact']?.post
  },
  // Müşteri randevu alma (sadece POST)
  '/appointments': {
    post: appointmentPaths['/appointments']?.post
  }
};

// PUBLIC API için şemalar
export const publicSchemas = {
  ...commonSchemas,
  ...healthSchemas,
  ...serviceSchemas,
  ...staffSchemas,
  ...contactSchemas,
  Service: serviceSchemas.Service,
  ServiceCategory: serviceSchemas.ServiceCategory,
  Staff: staffSchemas.Staff,
  StaffBasic: staffSchemas.StaffBasic,
  StaffAvailability: availabilitySchemas.StaffAvailability,
  ContactMessage: contactSchemas.ContactMessage,
  CreateContactMessageRequest: contactSchemas.CreateContactMessageRequest,
  CreateAppointmentRequest: appointmentSchemas.CreateAppointmentRequest,
  Appointment: appointmentSchemas.Appointment
};

export const allResponses = commonResponses;

// ADMIN API Konfigürasyonu (Tam erişim)
export const adminSwaggerConfig = {
  openapi: '3.0.3',
  info: {
    title: 'Kuaför Salonu Yönetim Sistemi - Admin API',
    description: 'Admin paneli için kapsamlı API - tüm CRUD işlemleri, raporlar ve yönetim fonksiyonları',
    version: '1.0.0',
    contact: {
      name: 'API Desteği',
      email: 'support@kuafor.com'
    }
  },
  servers: [
    {
      url: 'http://api.erencelik.info',
      description: 'Development Server'
    },
    {
      url: 'https://api.kuafor.com',
      description: 'Production Server'
    }
  ],
  tags: [
    { name: 'Health', description: 'Sistem sağlık kontrolleri' },
    { name: 'Authentication', description: 'Admin kimlik doğrulama' },
    { name: 'Admin', description: 'Admin yönetimi' },
    { name: 'Appointments', description: 'Randevu yönetimi (CRUD)' },
    { name: 'Services', description: 'Hizmet yönetimi (CRUD)' },
    { name: 'Customers', description: 'Müşteri yönetimi (CRUD)' },
    { name: 'Staff', description: 'Personel yönetimi (CRUD)' },
    { name: 'Content', description: 'İçerik yönetimi (CRUD)' },
    { name: 'Contact', description: 'İletişim yönetimi' },
    { name: 'Dashboard', description: 'Dashboard istatistikleri' },
    { name: 'Availability', description: 'Personel müsaitlik yönetimi' }
  ],
  paths: allPaths,
  components: {
    schemas: allSchemas,
    responses: allResponses,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Bearer token authentication. Format: Bearer <token>'
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
        description: 'API Key for super admin operations'
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

// PUBLIC API Konfigürasyonu (Sınırlı erişim)
export const publicSwaggerConfig = {
  openapi: '3.0.3',
  info: {
    title: 'Kuaför Salonu - Public API',
    description: 'Anasayfa ve müşteri işlemleri için public API - hizmet görüntüleme, personel bilgileri, randevu alma ve iletişim',
    version: '1.0.0',
    contact: {
      name: 'API Desteği',
      email: 'support@kuafor.com'
    }
  },
  servers: [
    {
      url: 'http://api.erencelik.info',
      description: 'Development Server'
    },
    {
      url: 'https://api.kuafor.com',
      description: 'Production Server'
    }
  ],
  tags: [
    { name: 'Health', description: 'Sistem sağlık kontrolleri' },
    { name: 'Services', description: 'Hizmet bilgileri (sadece okuma)' },
    { name: 'Staff', description: 'Personel bilgileri ve müsaitlik (sadece okuma)' },
    { name: 'Contact', description: 'İletişim mesajları gönderme' },
    { name: 'Appointments', description: 'Randevu alma (sadece oluşturma)' }
  ],
  paths: publicPaths,
  components: {
    schemas: publicSchemas,
    responses: allResponses,
    securitySchemes: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
        description: 'API Key for public operations'
      }
    }
  }
};

// Backward compatibility için
export const swaggerConfig = adminSwaggerConfig; 