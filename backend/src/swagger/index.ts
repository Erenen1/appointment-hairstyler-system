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

export const allResponses = commonResponses;

export const swaggerConfig = {
  openapi: '3.0.3',
  info: {
    title: 'Kuaför Salonu Yönetim Sistemi API',
    description: 'Kuaför salonu için randevu yönetimi, müşteri takibi, hizmet yönetimi ve daha fazlasını içeren kapsamlı API',
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
    { name: 'Authentication', description: 'Kimlik doğrulama işlemleri' },
    { name: 'Admin', description: 'Admin yönetimi' },
    { name: 'Appointments', description: 'Randevu yönetimi' },
    { name: 'Services', description: 'Hizmet yönetimi' },
    { name: 'Customers', description: 'Müşteri yönetimi' },
    { name: 'Staff', description: 'Personel yönetimi' },
    { name: 'Content', description: 'İçerik yönetimi' },
    { name: 'Contact', description: 'İletişim yönetimi' },
    { name: 'Dashboard', description: 'Dashboard istatistikleri' },
    { name: 'Availability', description: 'Personel müsaitlik yönetimi' }
  ],
  paths: allPaths,
  components: {
    schemas: allSchemas,
    responses: allResponses,
    securitySchemes: {
      sessionAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sessionid',
        description: 'Session-based authentication'
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
        description: 'API Key for super admin operations'
      }
    }
  },
  security: [{ sessionAuth: [] }]
}; 