import { Request, Response, NextFunction } from 'express';
const db = require('../models');
import { ApiError, ApiSuccess, HashUtils } from '../utils';
import { adminLoginSchema } from '../validations/authValidation';
import logger from '../config/logger';

/**
 * Admin giriş işlemi
 */
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validation
    const { error, value } = adminLoginSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { username, password } = value;

    // Admin kullanıcıyı bul
    const admin = await db.Admin.findOne({
      where: { 
        username,
        isActive: true 
      }
    });

    if (!admin) {
      throw ApiError.authentication('Kullanıcı adı veya şifre hatalı');
    }

    // Şifre kontrolü
    const isPasswordValid = HashUtils.verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      throw ApiError.authentication('Kullanıcı adı veya şifre hatalı');
    }

    // Son giriş tarihini güncelle
    await admin.update({ lastLogin: new Date() });

    // Session'a kullanıcı bilgilerini kaydet
    req.session.user = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      userType: 'admin',
      fullName: admin.fullName
    };

    // Session'ı kaydet (async olarak)
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

/**
 * Çıkış işlemi
 */
export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        throw ApiError.internal('Çıkış işlemi sırasında hata oluştu');
      }
      
      res.clearCookie('kuafor.sid'); // Session name ile aynı olmalı
      res.json(ApiSuccess.message('Çıkış başarılı'));
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mevcut kullanıcı bilgilerini getir
 */
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

/**
 * Session durumunu kontrol et
 */
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