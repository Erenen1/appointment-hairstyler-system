import { Request, Response, NextFunction } from 'express';
import { HashUtils, ApiError, ApiSuccess } from '../utils';
import { createAdminSchema, } from '../validations/adminValidation';
import { RegisterData } from '../types/auth';
import Joi from 'joi';

import db from '../models/index';
const { Admin } = db;

export const createAdminWithApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value }: { error: Joi.ValidationError, value: RegisterData } = createAdminSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const {password, fullName, email, phone, isActive = true } = value;
    const existingUsername = await Admin.findOne({ where: { email } });
    if (existingUsername) {
      throw ApiError.conflict('Bu e-posta adresi zaten kullanılıyor');
    }
    const existingEmail = await Admin.findOne({ where: { email } });
    if (existingEmail) {
      throw ApiError.conflict('Bu e-posta adresi zaten kullanılıyor');
    }
    const hashedPassword = HashUtils.hashPassword(password);
    const admin = await Admin.create({
      password: hashedPassword,
      fullName,
      email,
      phone,
      isActive
    });
    const adminData = admin.toJSON();
    delete adminData.password;
    res.status(201).json(ApiSuccess.created(adminData, 'Super Admin tarafından admin başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
}; 