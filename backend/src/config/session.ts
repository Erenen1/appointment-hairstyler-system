import session from 'express-session';
import { Enum } from './env';
export const sessionConfig = session({
  secret: Enum.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: 'lax',
  },
  name: 'kuafor.sid', 
  rolling: true 
});
export const corsConfig = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_DOMAIN || 'http://localhost:3000'
  ],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
  optionsSuccessStatus: 200
}; 