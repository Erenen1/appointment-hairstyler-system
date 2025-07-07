"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = exports.publicSwaggerConfig = exports.adminSwaggerConfig = exports.allResponses = exports.publicSchemas = exports.publicPaths = exports.allPaths = exports.allSchemas = void 0;
const common_1 = require("./schemas/common");
const health_1 = require("./schemas/health");
const auth_1 = require("./schemas/auth");
const admin_1 = require("./schemas/admin");
const appointment_1 = require("./schemas/appointment");
const service_1 = require("./schemas/service");
const customer_1 = require("./schemas/customer");
const staff_1 = require("./schemas/staff");
const content_1 = require("./schemas/content");
const contact_1 = require("./schemas/contact");
const dashboard_1 = require("./schemas/dashboard");
const availability_1 = require("./schemas/availability");
const health_2 = require("./paths/health");
const auth_2 = require("./paths/auth");
const admin_2 = require("./paths/admin");
const appointment_2 = require("./paths/appointment");
const service_2 = require("./paths/service");
const customer_2 = require("./paths/customer");
const staff_2 = require("./paths/staff");
const content_2 = require("./paths/content");
const contact_2 = require("./paths/contact");
const dashboard_2 = require("./paths/dashboard");
const availability_2 = require("./paths/availability");
const availabilitySchemas = {
    StaffAvailability: availability_1.StaffAvailabilitySchema,
    CreateAvailability: availability_1.CreateAvailabilitySchema,
    UpdateAvailability: availability_1.UpdateAvailabilitySchema,
    BulkCreateAvailability: availability_1.BulkCreateAvailabilitySchema,
    StaffAvailabilityWithAppointments: availability_1.StaffAvailabilityWithAppointmentsSchema,
    AllStaffAvailabilityResponse: availability_1.AllStaffAvailabilityResponseSchema
};
const availabilityPaths = {
    '/availability/all': availability_2.getAllStaffAvailability,
    '/availability': Object.assign(Object.assign({}, availability_2.getStaffAvailability), availability_2.createAvailability),
    '/availability/bulk': availability_2.bulkCreateAvailability,
    '/availability/{id}': Object.assign(Object.assign({}, availability_2.updateAvailability), availability_2.deleteAvailability)
};
exports.allSchemas = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, common_1.commonSchemas), health_1.healthSchemas), auth_1.authSchemas), admin_1.adminSchemas), appointment_1.appointmentSchemas), service_1.serviceSchemas), customer_1.customerSchemas), staff_1.staffSchemas), content_1.contentSchemas), contact_1.contactSchemas), dashboard_1.dashboardSchemas), availabilitySchemas);
exports.allPaths = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, health_2.healthPaths), auth_2.authPaths), admin_2.adminPaths), appointment_2.appointmentPaths), service_2.servicePaths), customer_2.customerPaths), staff_2.staffPaths), content_2.contentPaths), contact_2.contactPaths), dashboard_2.dashboardPaths), availabilityPaths);
exports.publicPaths = Object.assign(Object.assign({}, health_2.healthPaths), { '/services': {
        get: (_a = service_2.servicePaths['/services']) === null || _a === void 0 ? void 0 : _a.get
    }, '/services/{id}': {
        get: (_b = service_2.servicePaths['/services/{id}']) === null || _b === void 0 ? void 0 : _b.get
    }, '/services/{id}/staff-availability': service_2.servicePaths['/services/{id}/staff-availability'], '/staff': {
        get: (_c = staff_2.staffPaths['/staff']) === null || _c === void 0 ? void 0 : _c.get
    }, '/staff/{id}': {
        get: (_d = staff_2.staffPaths['/staff/{id}']) === null || _d === void 0 ? void 0 : _d.get
    }, '/staff/{id}/available-slots': staff_2.staffPaths['/staff/{id}/available-slots'], '/staff/{id}/available-slots-range': staff_2.staffPaths['/staff/{id}/available-slots-range'], '/contact': {
        post: (_e = contact_2.contactPaths['/contact']) === null || _e === void 0 ? void 0 : _e.post
    }, '/appointments': {
        post: (_f = appointment_2.appointmentPaths['/appointments']) === null || _f === void 0 ? void 0 : _f.post
    } });
exports.publicSchemas = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, common_1.commonSchemas), health_1.healthSchemas), service_1.serviceSchemas), staff_1.staffSchemas), contact_1.contactSchemas), { Service: service_1.serviceSchemas.Service, ServiceCategory: service_1.serviceSchemas.ServiceCategory, Staff: staff_1.staffSchemas.Staff, StaffBasic: staff_1.staffSchemas.StaffBasic, StaffAvailability: availabilitySchemas.StaffAvailability, ContactMessage: contact_1.contactSchemas.ContactMessage, CreateContactMessageRequest: contact_1.contactSchemas.CreateContactMessageRequest, CreateAppointmentRequest: appointment_1.appointmentSchemas.CreateAppointmentRequest, Appointment: appointment_1.appointmentSchemas.Appointment });
exports.allResponses = common_1.commonResponses;
exports.adminSwaggerConfig = {
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
    paths: exports.allPaths,
    components: {
        schemas: exports.allSchemas,
        responses: exports.allResponses,
        securitySchemes: {
            sessionAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'sessionid',
                description: 'Admin session authentication'
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
exports.publicSwaggerConfig = {
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
    paths: exports.publicPaths,
    components: {
        schemas: exports.publicSchemas,
        responses: exports.allResponses,
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
exports.swaggerConfig = exports.adminSwaggerConfig;
//# sourceMappingURL=index.js.map