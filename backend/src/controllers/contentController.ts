import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';

import db from '../models/index';
const { GalleryImage, GalleryCategory } = db;

export const getGalleryImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      categoryId, 
      isActive, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;
    
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
      whereConditions.isActive = isActive === 'true';
    }
    
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await GalleryImage.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: GalleryCategory,
          as: 'category',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [[sortBy.toString(), String(sortOrder).toUpperCase()]],
      limit: Number(limit),
      offset
    });
    
    const totalPages = Math.ceil(count / Number(limit));
    const paginationInfo = {
      currentPage: Number(page),
      totalPages,
      totalItems: count,
      itemsPerPage: Number(limit),
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1
    };
    
    res.json(ApiSuccess.list(rows, paginationInfo, 'Galeri resimleri başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createGalleryImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { imagePath, title, description, categoryId, isVisible } = req.body;
    
    if (!imagePath || !categoryId) {
      throw ApiError.badRequest('Resim yolu ve kategori ID zorunludur');
    }
    
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
