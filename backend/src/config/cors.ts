import Enum from './env';
import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: [
      Enum.DOMAIN,
      Enum.FRONTEND_DOMAIN,
      "kaancetin.com",
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
    optionsSuccessStatus: 200
  }; 