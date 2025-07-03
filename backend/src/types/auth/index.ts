import { Request } from 'express';
import { Admin, Customer, Staff } from '../models';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  isActive: boolean;
}

export interface TokenPayload {
  userId: string;
  userType: 'admin' | 'customer' | 'staff';
} 