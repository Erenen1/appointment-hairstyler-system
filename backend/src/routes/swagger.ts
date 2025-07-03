import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import Enum  from '../config/env';
import { dashboardSchemas } from '../swagger/schemas/dashboard';
import { appointmentSchemas } from '../swagger/schemas/appointment';
import { commonSchemas, commonResponses } from '../swagger/schemas/common';
import { dashboardPaths } from '../swagger/paths/dashboard';
import { appointmentPaths } from '../swagger/paths/appointment';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kuaför Sistemi API',
      version: '1.0.0',
      description: 'Kuaför salonu yönetim sistemi için RESTful API dokümantasyonu',
      contact: {
        name: 'API Desteği',
        email: 'support@kuafor.com'
      },
      license: {
        name: 'MIT',
        url: `${Enum.DOMAIN}`
      }
    },
    servers: [
      {
        url: `${Enum.DOMAIN}`,
        description: 'Development Server'
      },
      {
        url: `${Enum.DOMAIN}`,
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'kuafor.sid'
        }
      },
      schemas: {
        ...commonSchemas,
        ...dashboardSchemas,
        ...appointmentSchemas
      },
      responses: {
        ...commonResponses
      }
    },
    paths: {
      ...dashboardPaths,
      ...appointmentPaths
    },
    tags: [
      {
        name: 'Dashboard',
        description: 'Dashboard istatistikleri ve analitik veriler'
      },
      {
        name: 'Appointments',
        description: 'Randevu yönetimi işlemleri'
      },
      {
        name: 'Auth',
        description: 'Kimlik doğrulama işlemleri'
      },
      {
        name: 'Admin',
        description: 'Admin kullanıcı yönetimi'
      }
    ]
  },
  apis: ['./routes/*.ts', '../swagger/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};