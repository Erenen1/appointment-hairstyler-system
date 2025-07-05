"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = exports.allResponses = exports.allPaths = exports.allSchemas = void 0;
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
exports.allSchemas = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, common_1.commonSchemas), health_1.healthSchemas), auth_1.authSchemas), admin_1.adminSchemas), appointment_1.appointmentSchemas), service_1.serviceSchemas), customer_1.customerSchemas), staff_1.staffSchemas), content_1.contentSchemas), contact_1.contactSchemas), dashboard_1.dashboardSchemas);
exports.allPaths = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, health_2.healthPaths), auth_2.authPaths), admin_2.adminPaths), appointment_2.appointmentPaths), service_2.servicePaths), customer_2.customerPaths), staff_2.staffPaths), content_2.contentPaths), contact_2.contactPaths), dashboard_2.dashboardPaths);
exports.allResponses = common_1.commonResponses;
exports.swaggerConfig = {
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
            url: 'http://localhost:8000',
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
        { name: 'Dashboard', description: 'Dashboard istatistikleri' }
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
//# sourceMappingURL=index.js.map