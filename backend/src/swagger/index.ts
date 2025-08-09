import { commonSchemas, commonResponses } from './schemas/common';
import { healthSchemas } from './schemas/health';
import { authSchemas } from './schemas/auth';
import { appointmentSchemas } from './schemas/appointment';
import { serviceSchemas } from './schemas/service';
import { customerSchemas } from './schemas/customer';
import { staffSchemas } from './schemas/staff';
import { contactSchemas } from './schemas/contact';
import { dashboardSchemas } from './schemas/dashboard';
import { categorySchemas } from './schemas/category';
import { contentSchemas } from './schemas/content';
import { availabilitySchemas } from './schemas/availability';

import { healthPaths } from './paths/health';
import { authPaths } from './paths/auth';
import { appointmentPaths } from './paths/appointment';
import { servicePaths } from './paths/service';
import { customerPaths } from './paths/customer';
import { staffPaths } from './paths/staff';
import { contactPaths } from './paths/contact';
import { dashboardPaths } from './paths/dashboard';
import { superAdminPaths } from './paths/super-admin';
import { categoryPaths } from './paths/category';
import { contentPaths } from './paths/content';
import { availabilityPaths } from './paths/availability';

// Tüm şemalar
export const allSchemas = {
  ...commonSchemas,
  ...healthSchemas,
  ...authSchemas,
  ...appointmentSchemas,
  ...serviceSchemas,
  ...customerSchemas,
  ...staffSchemas,
  ...contactSchemas,
  ...dashboardSchemas,
  ...categorySchemas,
  ...contentSchemas,
  ...availabilitySchemas,
};

// Tüm path'ler
export const allPaths = {
  ...healthPaths,
  ...authPaths,
  ...appointmentPaths,
  ...servicePaths,
  ...customerPaths,
  ...staffPaths,
  ...contactPaths,
  ...dashboardPaths,
  ...superAdminPaths,
  ...categoryPaths,
  ...contentPaths,
  ...availabilityPaths,
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
  '/services/{id}/staff': servicePaths['/services/{id}/staff'],
  '/services/{id}/staff-availability': servicePaths['/services/{id}/staff-availability'],
  '/services/categories': {
    get: servicePaths['/services/categories']?.get
  },
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
  // Service schemas
  Service: serviceSchemas.Service,
  ServiceCategory: serviceSchemas.ServiceCategory,
  ServiceStaffMember: serviceSchemas.ServiceStaffMember,
  ServiceStaffAvailabilityResponse: serviceSchemas.ServiceStaffAvailabilityResponse,
  // Staff schemas
  Staff: staffSchemas.Staff,
  StaffBasic: staffSchemas.StaffBasic,
  AvailableSlot: staffSchemas.AvailableSlot,
  AvailableSlotsResponse: staffSchemas.AvailableSlotsResponse,
  AvailableSlotsRangeResponse: staffSchemas.AvailableSlotsRangeResponse,
  // Contact schemas
  ContactMessage: contactSchemas.ContactMessage,
  CreateContactMessageRequest: contactSchemas.CreateContactMessageRequest,
  // Appointment schemas
  CreateAppointmentRequest: appointmentSchemas.CreateAppointmentRequest,
  Appointment: appointmentSchemas.Appointment,
  // Content schemas
  GalleryCategory: contentSchemas.GalleryCategory,
  GalleryImage: contentSchemas.GalleryImage,
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
    { name: 'Appointments', description: 'Randevu yönetimi (CRUD)' },
    { name: 'Services', description: 'Hizmet yönetimi (CRUD)' },
    { name: 'Customers', description: 'Müşteri yönetimi (CRUD)' },
    { name: 'Staff', description: 'Personel yönetimi (CRUD)' },
    { name: 'Content', description: 'İçerik yönetimi (CRUD)' },
    { name: 'Contact', description: 'İletişim yönetimi' },
    { name: 'Dashboard', description: 'Dashboard istatistikleri' },
    { name: 'Availability', description: 'Personel müsaitlik yönetimi' },
    { name: 'Business Auth', description: 'İşletme Kimlik Doğrulama' },
    { name: 'Super Admin', description: 'Süper Yönetici İşlemleri' },
    { name: 'Categories', description: 'Kategori Yönetimi (CRUD)' },
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
    { name: 'Appointments', description: 'Randevu alma (sadece oluşturma)' },
    { name: 'Content', description: 'İçerik bilgileri (sadece okuma)' },
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

export const swaggerConfig = adminSwaggerConfig;