import { Request, Response } from 'express';
import { HashUtils, ApiError, ApiSuccess } from '../utils';
import { createAdminSchema } from '../validations/adminValidation';

const db = require('../models');
const { Admin } = db;

/**
 * Super Admin tarafından admin oluşturma (Sadece X-API-KEY ile erişim)
 */
export const createAdminWithApiKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = createAdminSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { username, password, fullName, email, phone, isActive = true } = value;

    // Kullanıcı adı kontrolü
    const existingUsername = await Admin.findOne({ where: { username } });
    if (existingUsername) {
      throw ApiError.conflict('Bu kullanıcı adı zaten kullanılıyor');
    }

    // E-posta kontrolü
    const existingEmail = await Admin.findOne({ where: { email } });
    if (existingEmail) {
      throw ApiError.conflict('Bu e-posta adresi zaten kullanılıyor');
    }

    // Şifre hash'leme
    const hashedPassword = HashUtils.hashPassword(password);

    // Admin oluşturma
    const admin = await Admin.create({
      username,
      password: hashedPassword,
      fullName,
      email,
      phone,
      isActive
    });

    // Şifreyi response'dan çıkar
    const adminData = admin.toJSON();
    delete adminData.password;

    res.status(201).json(ApiSuccess.created(adminData, 'Super Admin tarafından admin başarıyla oluşturuldu'));
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Sunucu hatası').toJSON());
    }
  }
}; 