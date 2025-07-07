import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess, HashUtils } from '../utils';
import { loginSchema } from '../validations/authValidation';
import logger from '../config/logger';
import { LoginCredentials } from '../types/auth';
import Joi from 'joi';

import db from '../models/index';
const { Admin } = db;

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value }: { error: Joi.ValidationError, value: LoginCredentials } = loginSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { email, password } = value;
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
    req.session.user = {
      id: admin.id,
      email: admin.email,
      userType: 'admin',
      fullName: admin.fullName
    };

    req.session.save((err) => {
      if (err) {
        logger.error('Session save error:', err);
        next(err);
        return;
      }
      res.json(ApiSuccess.item({
        sessionId: req.session.id,
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
    });
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
      res.clearCookie('sessionid');
      res.json(ApiSuccess.message('Çıkış başarılı'));
    });
  } catch (error) {
    next(error);
  }
};
export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(ApiSuccess.item({
      user: req.session.user
    }, 'Kullanıcı bilgileri getirildi'));
  } catch (error) {
    next(error);
  }
};
