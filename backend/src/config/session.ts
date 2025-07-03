import session from 'express-session';
import Enum  from './env';

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
  name: 'sessionid', 
  rolling: true 
});
