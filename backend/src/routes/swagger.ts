import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { Enum } from '../config/env';

// Schemas import
import { dashboardSchemas } from '../swagger/schemas/dashboard';
import { appointmentSchemas } from '../swagger/schemas/appointment';
import { commonSchemas, commonResponses } from '../swagger/schemas/common';

// Paths import
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
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development Server'
      },
      {
        url: 'https://api.kuafor.com',
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
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Kuaför API Dokümantasyonu'
    }));
    
    // JSON endpoint for the API docs
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });

    console.log(`📚 Swagger documentation available at: http://localhost:${Enum.PORT}/api-docs`);
  }
}; 