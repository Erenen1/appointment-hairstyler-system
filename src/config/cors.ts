import Enum from './env';
import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: true,
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-TENANT-ID', 'X-API-KEY',"Authorization Bearer"],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200
  }; 