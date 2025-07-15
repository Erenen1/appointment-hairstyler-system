import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess, HashUtils, JwtUtils } from '../utils';
import logger from '../config/logger';
import { LoginCredentials } from '../types/auth';

import db from '../models/index';
const { Admin } = db;

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({
      where: {
        email,
        isActive: true
      }
    });
    if (!admin) {
      throw ApiError.authentication('Email veya şifre hatalı');
    }
    const isPasswordValid = HashUtils.verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      throw ApiError.authentication('Email veya şifre hatalı');
    }
    await admin.update({ lastLogin: new Date() });
    
    // JWT token oluştur
    const token = JwtUtils.generateToken({
      id: admin.id,
      email: admin.email,
      userType: 'admin',
      fullName: admin.fullName
    });

    res.json(ApiSuccess.item({
      bearerAuth:token,
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        userType: 'admin',
        phone: admin.phone,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin
      }
    }, 'Giriş başarılı'));
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    // JWT ile logout client-side işlemidir
    // Server tarafında token'ı blacklist'e almanız gerekirse
    // bu işlemi burada yapabilirsiniz
    res.json(ApiSuccess.message('Çıkış başarılı'));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    // JWT middleware'dan gelen user bilgisi
    res.json(ApiSuccess.item({
      user: (req as any).user
    }, 'Kullanıcı bilgileri getirildi'));
  } catch (error) {
    next(error);
  }
};
