"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceStaff = exports.deleteServiceCategory = exports.updateServiceCategory = exports.createServiceCategory = exports.getServiceCategories = exports.deleteService = exports.updateService = exports.createService = exports.getServiceById = exports.getServices = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const serviceValidation_1 = require("../validations/serviceValidation");
const serviceValidation_2 = require("../validations/serviceValidation");
const controllerUtils_1 = require("../utils/controllerUtils");
const index_1 = __importDefault(require("../models/index"));
const { Service, ServiceCategory, ServiceImage, StaffService, Staff } = index_1.default;
const getServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search, categoryId, isActive, } = req.query;
        const where = {};
        if (search) {
            where[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { description: { [sequelize_1.Op.iLike]: `%${search}%` } }
            ];
        }
        if (categoryId)
            where.categoryId = categoryId;
        if (isActive !== undefined)
            where.isActive = isActive === 'true';
        const { offset, limit: limitOption } = (0, controllerUtils_1.getPaginationOptions)(Number(page), Number(limit));
        const { count, rows: services } = yield Service.findAndCountAll({
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
                    attributes: ['id', 'imagePath']
                },
                {
                    model: Staff,
                    as: 'staffMembers',
                    attributes: ['id', 'fullName', 'isActive']
                }
            ],
            offset,
            limit: limitOption
        });
        const formattedServices = services.map(service => {
            var _a, _b, _c, _d, _e, _f;
            const mainImage = ((_b = (_a = service.images) === null || _a === void 0 ? void 0 : _a.find(img => img.isMain)) === null || _b === void 0 ? void 0 : _b.imagePath) ||
                ((_d = (_c = service.images) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.imagePath);
            return {
                id: service.id,
                slug: service.slug,
                title: service.title,
                description: service.description,
                price: service.price,
                image: mainImage,
                duration: service.duration,
                category: service.category,
                isActive: service.isActive,
                staffMembers: ((_f = (_e = service.staffMembers) === null || _e === void 0 ? void 0 : _e.filter(staff => staff.isActive)) === null || _f === void 0 ? void 0 : _f.map(staff => ({
                    id: staff.id,
                    fullName: staff.fullName
                }))) || []
            };
        });
        res.status(200).json(utils_1.ApiSuccess.list(formattedServices, null, 'Hizmetler başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getServices = getServices;
const getServiceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { error, value } = serviceValidation_1.serviceIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { id } = value;
        const service = yield Service.findByPk(id, {
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
                    as: 'staffMembers',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'firstName', 'lastName', 'isActive']
                }
            ]
        });
        if (!service) {
            throw utils_1.ApiError.notFound('Hizmet bulunamadı');
        }
        const formattedService = Object.assign(Object.assign({}, service.toJSON()), { staffMembers: ((_b = (_a = service.staffMembers) === null || _a === void 0 ? void 0 : _a.filter(staff => staff.isActive)) === null || _b === void 0 ? void 0 : _b.map(staff => ({
                id: staff.id,
                firstName: staff.firstName,
                lastName: staff.lastName,
                fullName: `${staff.firstName} ${staff.lastName}`
            }))) || [] });
        res.json(utils_1.ApiSuccess.item(formattedService, 'Hizmet detayları başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getServiceById = getServiceById;
const createService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = (0, serviceValidation_2.validateService)(req.body);
        if (!validationResult.success) {
            throw utils_1.ApiError.badRequest('Validasyon hatası', validationResult.errors);
        }
        const service = yield Service.create(req.body);
        const staffIds = req.body.staffIds;
        if (staffIds && staffIds.length > 0) {
            yield Promise.all(staffIds.map(staffId => StaffService.create({
                staffId: staffId,
                serviceId: service.id,
                isActive: true
            })));
        }
        const serviceWithStaff = yield Service.findByPk(service.id, {
            include: [
                {
                    model: ServiceCategory,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: Staff,
                    as: 'staffMembers',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'fullName']
                }
            ]
        });
        res.status(201).json(utils_1.ApiSuccess.created(serviceWithStaff, 'Hizmet başarıyla oluşturuldu'));
    }
    catch (error) {
        next(error);
    }
});
exports.createService = createService;
const updateService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const validationResult = (0, serviceValidation_2.validateService)(req.body);
        if (!validationResult.success) {
            throw utils_1.ApiError.badRequest('Validasyon hatası', validationResult.errors);
        }
        const service = yield Service.findByPk(id);
        if (!service) {
            throw utils_1.ApiError.notFound('Hizmet bulunamadı');
        }
        yield service.update(req.body);
        const staffIds = req.body.staffIds;
        if (staffIds && Array.isArray(staffIds)) {
            yield StaffService.destroy({
                where: { serviceId: id }
            });
            if (staffIds.length > 0) {
                yield Promise.all(staffIds.map(staffId => StaffService.create({
                    staffId: staffId,
                    serviceId: id,
                    isActive: true
                })));
            }
        }
        const updatedServiceWithStaff = yield Service.findByPk(id, {
            include: [
                {
                    model: ServiceCategory,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: Staff,
                    as: 'staffMembers',
                    through: {
                        model: StaffService,
                        attributes: ['isActive']
                    },
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });
        res.status(200).json(utils_1.ApiSuccess.updated(updatedServiceWithStaff, 'Hizmet başarıyla güncellendi'));
    }
    catch (error) {
        next(error);
    }
});
exports.updateService = updateService;
const deleteService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const service = yield Service.findByPk(id);
        if (!service) {
            throw utils_1.ApiError.notFound('Hizmet bulunamadı');
        }
        yield service.destroy();
        res.status(200).json(utils_1.ApiSuccess.deleted('Hizmet başarıyla silindi'));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteService = deleteService;
const getServiceCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = serviceValidation_1.categoryListQuerySchema.validate(req.query);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { page, limit, search, isActive, sortBy, sortOrder } = value;
        const where = {};
        if (search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { description: { [sequelize_1.Op.iLike]: `%${search}%` } }
            ];
        }
        if (isActive !== undefined)
            where.isActive = isActive;
        const { offset, limit: limitOption } = (0, controllerUtils_1.getPaginationOptions)(page, limit);
        const { count, rows: categories } = yield ServiceCategory.findAndCountAll({
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
        const formattedCategories = categories.map(category => {
            var _a;
            return ({
                id: category.id,
                name: category.name,
                description: category.description,
                imagePath: category.imagePath,
                orderIndex: category.orderIndex,
                isActive: category.isActive,
                serviceCount: ((_a = category.services) === null || _a === void 0 ? void 0 : _a.length) || 0,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt
            });
        });
        const pagination = (0, controllerUtils_1.formatPaginationResponse)(count, page, limit);
        res.status(200).json(utils_1.ApiSuccess.list(formattedCategories, pagination, 'Hizmet kategorileri başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getServiceCategories = getServiceCategories;
const createServiceCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, imagePath, orderIndex, isActive } = req.body;
        if (!name) {
            throw utils_1.ApiError.badRequest('Kategori adı gereklidir');
        }
        const existingCategory = yield ServiceCategory.findOne({
            where: { name: { [sequelize_1.Op.iLike]: name } }
        });
        if (existingCategory) {
            throw utils_1.ApiError.conflict('Bu isimde bir kategori zaten mevcut');
        }
        const category = yield ServiceCategory.create({
            name,
            description,
            imagePath,
            orderIndex: orderIndex || 0,
            isActive: isActive !== undefined ? isActive : true
        });
        res.status(201).json(utils_1.ApiSuccess.created(category, 'Hizmet kategorisi başarıyla oluşturuldu'));
    }
    catch (error) {
        next(error);
    }
});
exports.createServiceCategory = createServiceCategory;
const updateServiceCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = serviceValidation_1.categoryIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { id } = value;
        const { name, description, imagePath, orderIndex, isActive } = req.body;
        const category = yield ServiceCategory.findByPk(id);
        if (!category) {
            throw utils_1.ApiError.notFound('Hizmet kategorisi bulunamadı');
        }
        if (name && name !== category.name) {
            const existingCategory = yield ServiceCategory.findOne({
                where: {
                    name: { [sequelize_1.Op.iLike]: name },
                    id: { [sequelize_1.Op.ne]: id }
                }
            });
            if (existingCategory) {
                throw utils_1.ApiError.conflict('Bu isimde bir kategori zaten mevcut');
            }
        }
        yield category.update({
            name: name || category.name,
            description: description !== undefined ? description : category.description,
            imagePath: imagePath !== undefined ? imagePath : category.imagePath,
            orderIndex: orderIndex !== undefined ? orderIndex : category.orderIndex,
            isActive: isActive !== undefined ? isActive : category.isActive
        });
        res.status(200).json(utils_1.ApiSuccess.updated(category, 'Hizmet kategorisi başarıyla güncellendi'));
    }
    catch (error) {
        next(error);
    }
});
exports.updateServiceCategory = updateServiceCategory;
const deleteServiceCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = serviceValidation_1.categoryIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { id } = value;
        const category = yield ServiceCategory.findByPk(id);
        if (!category) {
            throw utils_1.ApiError.notFound('Hizmet kategorisi bulunamadı');
        }
        const serviceCount = yield Service.count({
            where: { categoryId: id }
        });
        if (serviceCount > 0) {
            throw utils_1.ApiError.badRequest('Bu kategoriye ait hizmetler bulunduğu için kategori silinemez');
        }
        yield category.destroy();
        res.status(200).json(utils_1.ApiSuccess.deleted('Hizmet kategorisi başarıyla silindi'));
    }
    catch (error) {
        next(error);
    }
});
exports.deleteServiceCategory = deleteServiceCategory;
const getServiceStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = serviceValidation_1.serviceIdSchema.validate(req.params);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { id } = value;
        const service = yield Service.findByPk(id);
        if (!service) {
            throw utils_1.ApiError.notFound('Hizmet bulunamadı');
        }
        const staffServices = yield StaffService.findAll({
            where: {
                serviceId: id,
                isActive: true
            },
            include: [
                {
                    model: Staff,
                    as: 'staff',
                    where: { isActive: true },
                    attributes: ['id', 'fullName', 'specialties', 'avatar']
                }
            ],
            order: [[{ model: Staff, as: 'staff' }, 'fullName', 'ASC']]
        });
        const formattedStaff = staffServices.map(staffService => ({
            id: staffService.staff.id,
            fullName: staffService.staff.fullName,
            specialties: staffService.staff.specialties,
            avatar: staffService.staff.avatar,
            canProvideService: staffService.isActive
        }));
        res.json(utils_1.ApiSuccess.list(formattedStaff, null, 'Hizmeti veren personeller başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getServiceStaff = getServiceStaff;
//# sourceMappingURL=serviceController.js.map