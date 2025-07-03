import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import Enum from '../config/env';
import { swaggerConfig } from '../swagger';

const options = {
  definition: {
    ...swaggerConfig,
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

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};