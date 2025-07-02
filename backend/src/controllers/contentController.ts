import { Request, Response } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op, fn, col } from 'sequelize';
import { 
  createGalleryImageSchema,
  createBannerSchema,
  contentListQuerySchema,
  contentIdSchema
} from '../validations/contentValidation';
const db = require('../models');
const { GalleryImage, GalleryCategory, Service } = db;
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
export const getGalleryImages = async (req: Request, res: Response): Promise<void> => {
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
          attributes: ['id', 'name', 'color']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset
    });
    const totalPages = Math.ceil(count / limit);
    res.json(new ApiSuccess('Galeri resimleri başarıyla getirildi', {
      images: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Galeri resimleri getirilirken hata oluştu');
  }
};
export const createGalleryImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = createGalleryImageSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { imageUrl, title, description, categoryId, tags, isActive } = value;
    const category = await GalleryCategory.findByPk(categoryId);
    if (!category) {
      throw ApiError.notFound('Galeri kategorisi bulunamadı');
    }
    const image = await GalleryImage.create({
      imageUrl,
      title,
      description,
      categoryId,
      tags: tags || [],
      isActive,
      uploadedBy: req.user?.id
    });
    const createdImage = await GalleryImage.findByPk(image.id, {
      include: [
        {
          model: GalleryCategory,
          as: 'category',
          attributes: ['id', 'name', 'color']
        }
      ]
    });
    res.status(201).json(new ApiSuccess('Galeri resmi başarıyla eklendi', { image: createdImage }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Galeri resmi eklenirken hata oluştu');
  }
};
