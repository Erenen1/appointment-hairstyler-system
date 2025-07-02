import { Request, Response } from 'express';
import { ApiError, ApiSuccess, handleControllerError } from '../utils';
import { AuthenticatedRequest } from '../types/express';
import { Op } from 'sequelize';
import { 
  createServiceSchema, 
  updateServiceSchema,
  createServiceCategorySchema,
  updateServiceCategorySchema,
  serviceListQuerySchema,
  categoryListQuerySchema,
  serviceIdSchema,
  categoryIdSchema
} from '../validations/serviceValidation';

import db from "../models"
import { validateService } from '../validations/serviceValidation';
import { getPaginationOptions, formatPaginationResponse } from '../utils/controllerUtils';

const { Service, ServiceCategory, ServiceImage, Staff } = db;

// AuthenticatedRequest artık types/express.ts'den import ediliyor

/**
 * Tüm hizmetleri listele
 */
export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      isActive,
      isPopular,
      minPrice,
      maxPrice,
      sortBy = 'orderIndex',
      sortOrder = 'asc'
    } = req.query;

    const where: any = {};
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (isPopular !== undefined) where.isPopular = isPopular === 'true';
    if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

    const { offset, limit: limitOption } = getPaginationOptions(Number(page), Number(limit));

    const { count, rows: services } = await Service.findAndCountAll({
      where,
      include: [
        {
          model: ServiceCategory,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: ServiceImage,
          as: 'images',
          attributes: ['id', 'imagePath', 'isMain', 'orderIndex']
        },
        {
          model: Staff,
          as: 'staff',
          attributes: ['id', 'firstName', 'lastName', 'profileImage', 'specialties'],
          where: { isActive: true },
          required: false
        }
      ],
      order: [[sortBy as string, sortOrder as string]],
      offset,
      limit: limitOption
    });

    const formattedServices = services.map(service => {
      const mainImage = service.images?.find(img => img.isMain)?.imagePath || 
                       service.images?.[0]?.imagePath;
      
      return {
        id: service.id,
        slug: service.slug,
        title: service.title,
        shortDescription: service.shortDescription,
        price: service.price,
        image: mainImage,
        icon: service.icon,
        duration: service.duration,
        category: service.category,
        isPopular: service.isPopular,
        isActive: service.isActive
      };
    });

    const pagination = formatPaginationResponse(count, Number(page), Number(limit));

    res.status(200).json({
      success: true,
      message: 'Hizmetler başarıyla getirildi',
      data: {
        services: formattedServices,
        pagination
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hizmetler getirilirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

/**
 * Tek bir hizmetin detayını getir
 */
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Params validate et
    const { error, value } = serviceIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { id } = value;

    const service = await Service.findByPk(id, {
      include: [
        {
          model: ServiceCategory,
          as: 'category',
          attributes: ['id', 'name', 'description']
        },
        {
          model: ServiceImage,
          as: 'images',
          attributes: ['id', 'imagePath']
        },
        {
          model: Staff,
          as: 'staff',
          through: { attributes: [] },
          attributes: ['id', 'firstName', 'lastName', 'profileImage', 'specialties'],
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }

    res.json(new ApiSuccess('Hizmet detayları başarıyla getirildi', service));

  } catch (error) {
    
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Hizmet detayları getirilirken hata oluştu').toJSON());
    }
  }
};

/**
 * Yeni hizmet oluştur
 */
export const createService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validationResult = validateService(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: validationResult.errors
      });
      return;
    }

    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Hizmet başarıyla oluşturuldu',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hizmet oluşturulurken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

/**
 * Hizmet güncelle
 */
export const updateService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validationResult = validateService(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: validationResult.errors
      });
      return;
    }

    const service = await Service.findByPk(id);
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Hizmet bulunamadı'
      });
      return;
    }

    await service.update(req.body);
    res.status(200).json({
      success: true,
      message: 'Hizmet başarıyla güncellendi',
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hizmet güncellenirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

/**
 * Hizmet sil
 */
export const deleteService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      res.status(404).json({
        success: false,
        message: 'Hizmet bulunamadı'
      });
      return;
    }

    await service.destroy();
    res.status(200).json({
      success: true,
      message: 'Hizmet başarıyla silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Hizmet silinirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    });
  }
};

// Kategori işlemleri

/**
 * Tüm hizmet kategorilerini listele
 */
export const getServiceCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query parametrelerini validate et
    const { error, value } = categoryListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { page, limit, search, isActive, sortBy, sortOrder } = value;

    // Filtreleme koşulları
    const whereConditions: any = {};
    
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (typeof isActive === 'boolean') {
      whereConditions.isActive = isActive;
    }

    // Sayfalama
    const offset = (page - 1) * limit;

    // Verileri getir
    const { count, rows } = await ServiceCategory.findAndCountAll({
      where: whereConditions,
      attributes: [
        'id', 'name', 'description', 'isActive', 'createdAt',
        [db.sequelize.fn('COUNT', db.sequelize.col('services.id')), 'servicesCount']
      ],
      include: [
        {
          model: Service,
          as: 'services',
          attributes: [],
          where: { isActive: true },
          required: false
        }
      ],
      group: ['ServiceCategory.id'],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
      subQuery: false
    });

    const totalPages = Math.ceil(count.length / limit);

    res.json(new ApiSuccess('Kategoriler başarıyla getirildi', {
      categories: rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count.length,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }));

  } catch (error) {
    
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Kategoriler getirilirken hata oluştu').toJSON());
    }
  }
};

/**
 * Yeni hizmet kategorisi oluştur
 */
export const createServiceCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Body validate et
    const { error, value } = createServiceCategorySchema.validate(req.body);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { name, description, isActive } = value;

    // Aynı isimde kategori kontrolü
    const existingCategory = await ServiceCategory.findOne({
      where: { name: { [Op.iLike]: name } }
    });

    if (existingCategory) {
      throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
    }

    // Kategoriyi oluştur
    const category = await ServiceCategory.create({
      name,
      description,
      isActive: isActive
    });

    res.status(201).json(new ApiSuccess('Kategori başarıyla oluşturuldu', category));

  } catch (error) {
    
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Kategori oluşturulurken hata oluştu').toJSON());
    }
  }
};

/**
 * Hizmet kategorisi güncelle
 */
export const updateServiceCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Params validate et
    const { error: paramsError, value: paramsValue } = categoryIdSchema.validate(req.params);
    if (paramsError) {
      throw ApiError.fromJoi(paramsError);
    }

    // Body validate et
    const { error: bodyError, value: bodyValue } = updateServiceCategorySchema.validate(req.body);
    if (bodyError) {
      throw ApiError.fromJoi(bodyError);
    }

    const { id } = paramsValue;
    const updateData = bodyValue;

    // Kategori kontrolü
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      throw ApiError.notFound('Kategori bulunamadı');
    }

    // İsim değiştiriliyorsa tekrar kontrolü
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await ServiceCategory.findOne({
        where: { 
          name: { [Op.iLike]: updateData.name },
          id: { [Op.ne]: id }
        }
      });

      if (existingCategory) {
        throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
      }
    }

    // Kategoriyi güncelle
    await category.update(updateData);

    res.json(new ApiSuccess('Kategori başarıyla güncellendi', category));

  } catch (error) {
    
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Kategori güncellenirken hata oluştu').toJSON());
    }
  }
};

/**
 * Hizmet kategorisi sil
 */
export const deleteServiceCategory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Params validate et
    const { error, value } = categoryIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }

    const { id } = value;

    // Kategori kontrolü
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      throw ApiError.notFound('Kategori bulunamadı');
    }

    // Bu kategoriye ait hizmet kontrolü
    const servicesCount = await Service.count({
      where: { categoryId: id, isActive: true }
    });

    if (servicesCount > 0) {
      throw ApiError.badRequest('Bu kategoriye ait aktif hizmetler bulunmaktadır. Önce hizmetleri başka kategoriye taşıyın.');
    }

    // Soft delete yap
    await category.update({ isActive: false });

    res.json(new ApiSuccess('Kategori başarıyla silindi', null));

  } catch (error) {
    
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error.toJSON());
    } else {
      res.status(500).json(ApiError.internal('Kategori silinirken hata oluştu').toJSON());
    }
  }
}; 