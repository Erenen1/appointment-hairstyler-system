declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      fullName: string;
      email: string;
      userType: 'admin' | 'staff';
    };
  }
}

export interface SessionUser {
  id: number;
  fullName: string;
  email: string;
  userType: 'admin' | 'staff';
}