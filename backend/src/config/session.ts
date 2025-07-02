import session from 'express-session';
import { Enum } from './env';

/**
 * Session middleware configuration
 */
export const sessionConfig = session({
  secret: Enum.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Development için false, production'da reverse proxy ile HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 saat
    sameSite: 'lax',
  },
  name: 'kuafor.sid', // Custom session name
  rolling: true // Her istekte cookie'nin süresini yenile
});

/**
 * CORS configuration
 */
export const corsConfig = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true, // Cookie gönderimi için gerekli
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
  optionsSuccessStatus: 200
}; 