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

// ==================== GALERİ YÖNETİMİ ====================

/**
 * Galeri resimlerini listele
 * GET /api/v1/content/gallery
 */
export const getGalleryImages = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query parametrelerini validate et
    const { error, value } = contentListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { page, limit, search, categoryId, isActive, sortBy, sortOrder } = value;

    // Filtreleme koşulları
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

    // Sayfalama
    const offset = (page - 1) * limit;

    // Galeri resimlerini getir
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

/**
 * Yeni galeri resmi ekle
 * POST /api/v1/content/gallery
 */
export const createGalleryImage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Body validate et
    const { error, value } = createGalleryImageSchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { imageUrl, title, description, categoryId, tags, isActive } = value;

    // Kategori kontrolü
    const category = await GalleryCategory.findByPk(categoryId);
    if (!category) {
      throw ApiError.notFound('Galeri kategorisi bulunamadı');
    }

    // Galeri resmini oluştur
    const image = await GalleryImage.create({
      imageUrl,
      title,
      description,
      categoryId,
      tags: tags || [],
      isActive,
      uploadedBy: req.user?.id
    });

    // Oluşturulan resmi detaylarıyla getir
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

 