import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';
import { 
  createGalleryImageSchema,
  contentListQuerySchema,
} from '../validations/contentValidation';

import db from '../models/index';
const { GalleryImage, GalleryCategory } = db;

export const getGalleryImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = contentListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { page, limit, search, categoryId, isActive, sortBy, sortOrder } = value;
    const whereConditions: any = {};
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (categoryId) {
      whereConditions.categoryId = categoryId;
    }
    if (isActive !== undefined) {
      whereConditions.isActive = isActive;
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await GalleryImage.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: GalleryCategory,
          as: 'category',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset
    });
    const totalPages = Math.ceil(count / limit);
    const paginationInfo = {
      currentPage: page,
      totalPages,
      totalItems: count,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
    res.json(ApiSuccess.list(rows, paginationInfo, 'Galeri resimleri başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createGalleryImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = createGalleryImageSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { imagePath, title, description, categoryId, isVisible } = value;
    const category = await GalleryCategory.findByPk(categoryId);
    if (!category) {
      throw ApiError.notFound('Galeri kategorisi bulunamadı');
    }
    const image = await GalleryImage.create({
      imagePath,
      title,
      description,
      categoryId,
      isVisible: isVisible !== undefined ? isVisible : true
    });
    const createdImage = await GalleryImage.findByPk(image.id, {
      include: [
        {
          model: GalleryCategory,
          as: 'category',
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    res.status(201).json(ApiSuccess.created(createdImage, 'Galeri resmi başarıyla eklendi'));
  } catch (error) {
    next(error);
  }
};
