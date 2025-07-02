import { Request, Response, NextFunction } from 'express';
const db = require('../models');
import { ApiError, ApiSuccess, HashUtils } from '../utils';
import { adminLoginSchema } from '../validations/authValidation';
import logger from '../config/logger';
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = adminLoginSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { username, password } = value;
    const admin = await db.Admin.findOne({
      where: { 
        username,
        isActive: true 
      }
    });
    if (!admin) {
      throw ApiError.authentication('Kullanıcı adı veya şifre hatalı');
    }
    const isPasswordValid = HashUtils.verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      throw ApiError.authentication('Kullanıcı adı veya şifre hatalı');
    }
    await admin.update({ lastLogin: new Date() });
    req.session.user = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      userType: 'admin',
      fullName: admin.fullName
    };
    req.session.save((err) => {
      if (err) {
        logger.error('Session save error:', err);
      }
    });
    res.json(ApiSuccess.item({
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        userType: 'admin'
      }
    }, 'Giriş başarılı'));
  } catch (error) {
    next(error);
  }
};
export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw ApiError.internal('Çıkış işlemi sırasında hata oluştu');
      }
      res.clearCookie('kuafor.sid'); 
      res.json(ApiSuccess.message('Çıkış başarılı'));
    });
  } catch (error) {
    next(error);
  }
};
export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.session.user) {
      throw ApiError.authentication('Oturum bulunamadı');
    }
    res.json(ApiSuccess.item({
      user: req.session.user
    }, 'Kullanıcı bilgileri getirildi'));
  } catch (error) {
    next(error);
  }
};
export const checkSession = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAuthenticated = !!req.session.user;
    res.json(ApiSuccess.item({
      isAuthenticated,
      user: isAuthenticated ? req.session.user : null
    }, 'Session durumu'));
  } catch (error) {
    next(error);
  }
}; 