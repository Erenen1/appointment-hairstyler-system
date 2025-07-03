import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiSuccess } from '../utils';
import { Op } from 'sequelize';
import { 
  createServiceSchema, 
  updateServiceSchema,
  serviceIdSchema,
  categoryListQuerySchema,
  categoryIdSchema
} from '../validations/serviceValidation';
import { validateService } from '../validations/serviceValidation';
import { getPaginationOptions, formatPaginationResponse } from '../utils/controllerUtils';

import db from '../models/index';
const { Service, ServiceCategory, ServiceImage, Staff } = db;

export const getServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        { title: { [Op.iLike]: `%${search}%` } },
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
          attributes: ['id', 'fullName', 'avatar'],
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
    res.status(200).json(ApiSuccess.list(formattedServices, pagination, 'Hizmetler başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
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
          attributes: ['id', 'fullName', 'profileImage'],
          where: { isActive: true },
          required: false
        }
      ]
    });
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }
    res.json(ApiSuccess.item(service, 'Hizmet detayları başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validationResult = validateService(req.body);
    if (!validationResult.success) {
      throw ApiError.badRequest('Validasyon hatası', validationResult.errors);
    }
    const service = await Service.create(req.body);
    res.status(201).json(ApiSuccess.created(service, 'Hizmet başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const validationResult = validateService(req.body);
    if (!validationResult.success) {
      throw ApiError.badRequest('Validasyon hatası', validationResult.errors);
    }
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }
    await service.update(req.body);
    res.status(200).json(ApiSuccess.updated(service, 'Hizmet başarıyla güncellendi'));
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Hizmet bulunamadı');
    }
    await service.destroy();
    res.status(200).json(ApiSuccess.deleted('Hizmet başarıyla silindi'));
  } catch (error) {
    next(error);
  }
};

export const getServiceCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = categoryListQuerySchema.validate(req.query);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { page, limit, search, isActive, sortBy, sortOrder } = value;
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (isActive !== undefined) where.isActive = isActive;
    const { offset, limit: limitOption } = getPaginationOptions(page, limit);
    const { count, rows: categories } = await ServiceCategory.findAndCountAll({
      where,
      include: [
        {
          model: Service,
          as: 'services',
          attributes: ['id'],
          required: false
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      offset,
      limit: limitOption
    });
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      imagePath: category.imagePath,
      orderIndex: category.orderIndex,
      isActive: category.isActive,
      serviceCount: category.services?.length || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));
    const pagination = formatPaginationResponse(count, page, limit);
    res.status(200).json(ApiSuccess.list(formattedCategories, pagination, 'Hizmet kategorileri başarıyla getirildi'));
  } catch (error) {
    next(error);
  }
};

export const createServiceCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, imagePath, orderIndex, isActive } = req.body;
    if (!name) {
      throw ApiError.badRequest('Kategori adı gereklidir');
    }
    const existingCategory = await ServiceCategory.findOne({
      where: { name: { [Op.iLike]: name } }
    });
    if (existingCategory) {
      throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
    }
    const category = await ServiceCategory.create({
      name,
      description,
      imagePath,
      orderIndex: orderIndex || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    res.status(201).json(ApiSuccess.created(category, 'Hizmet kategorisi başarıyla oluşturuldu'));
  } catch (error) {
    next(error);
  }
};

export const updateServiceCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = categoryIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { id } = value;
    const { name, description, imagePath, orderIndex, isActive } = req.body;
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      throw ApiError.notFound('Hizmet kategorisi bulunamadı');
    }
    if (name && name !== category.name) {
      const existingCategory = await ServiceCategory.findOne({
        where: { 
          name: { [Op.iLike]: name },
          id: { [Op.ne]: id }
        }
      });
      if (existingCategory) {
        throw ApiError.conflict('Bu isimde bir kategori zaten mevcut');
      }
    }
    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      imagePath: imagePath !== undefined ? imagePath : category.imagePath,
      orderIndex: orderIndex !== undefined ? orderIndex : category.orderIndex,
      isActive: isActive !== undefined ? isActive : category.isActive
    });
    res.status(200).json(ApiSuccess.updated(category, 'Hizmet kategorisi başarıyla güncellendi'));
  } catch (error) {
    next(error);
  }
};

export const deleteServiceCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = categoryIdSchema.validate(req.params);
    if (error) {
      throw ApiError.fromJoi(error);
    }
    const { id } = value;
    const category = await ServiceCategory.findByPk(id);
    if (!category) {
      throw ApiError.notFound('Hizmet kategorisi bulunamadı');
    }
    const serviceCount = await Service.count({
      where: { categoryId: id }
    });
    if (serviceCount > 0) {
      throw ApiError.badRequest('Bu kategoriye ait hizmetler bulunduğu için kategori silinemez');
    }
    await category.destroy();
    res.status(200).json(ApiSuccess.deleted('Hizmet kategorisi başarıyla silindi'));
  } catch (error) {
    next(error);
  }
}; 