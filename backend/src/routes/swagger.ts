import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import Enum from '../config/env';
import { adminSwaggerConfig, publicSwaggerConfig } from '../swagger';

// Admin API Swagger Options
const adminOptions = {
  definition: {
    ...adminSwaggerConfig,
    servers: [
      {
        url: `${Enum.DOMAIN}`,
        description: 'Development Server'
      },
      {
        url: `${Enum.DOMAIN}`,
        description: 'Production Server'
      }
    ]
  },
  apis: ['./routes/*.ts', '../swagger/**/*.ts'],
};

// Public API Swagger Options
const publicOptions = {
  definition: {
    ...publicSwaggerConfig,
    servers: [
      {
        url: `${Enum.DOMAIN}`,
        description: 'Development Server'
      },
      {
        url: `${Enum.DOMAIN}`,
        description: 'Production Server'
      }
    ]
  },
  apis: ['./routes/*.ts', '../swagger/**/*.ts'],
};

const adminSwaggerSpec = swaggerJSDoc(adminOptions);
const publicSwaggerSpec = swaggerJSDoc(publicOptions);

export const setupSwagger = (app: Express) => {
  // Admin API Documentation (Tam erişim)
  app.use('/api-docs/admin', swaggerUi.serve);
  app.get('/api-docs/admin', swaggerUi.setup(adminSwaggerSpec, {
    customSiteTitle: 'Admin API Documentation',
    customCss: '.swagger-ui .topbar { background-color: #dc3545; }',
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelRendering: 'example'
    }
  }));

  // Public API Documentation (Sınırlı erişim)
  app.use('/api-docs/public', swaggerUi.serve);
  app.get('/api-docs/public', swaggerUi.setup(publicSwaggerSpec, {
    customSiteTitle: 'Public API Documentation',
    customCss: '.swagger-ui .topbar { background-color: #28a745; }',
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelRendering: 'example'
    }
  }));

  // Backward compatibility - admin API'si için
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(adminSwaggerSpec));
};