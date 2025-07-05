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
exports.createGalleryImage = exports.getGalleryImages = void 0;
const utils_1 = require("../utils");
const sequelize_1 = require("sequelize");
const contentValidation_1 = require("../validations/contentValidation");
const index_1 = __importDefault(require("../models/index"));
const { GalleryImage, GalleryCategory } = index_1.default;
const getGalleryImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = contentValidation_1.contentListQuerySchema.validate(req.query);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { page, limit, search, categoryId, isActive, sortBy, sortOrder } = value;
        const whereConditions = {};
        if (search) {
            whereConditions[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.like]: `%${search}%` } },
                { description: { [sequelize_1.Op.like]: `%${search}%` } }
            ];
        }
        if (categoryId) {
            whereConditions.categoryId = categoryId;
        }
        if (isActive !== undefined) {
            whereConditions.isActive = isActive;
        }
        const offset = (page - 1) * limit;
        const { count, rows } = yield GalleryImage.findAndCountAll({
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
        res.json(utils_1.ApiSuccess.list(rows, paginationInfo, 'Galeri resimleri başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getGalleryImages = getGalleryImages;
const createGalleryImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = contentValidation_1.createGalleryImageSchema.validate(req.body);
        if (error) {
            throw utils_1.ApiError.fromJoi(error);
        }
        const { imagePath, title, description, categoryId, isVisible } = value;
        const category = yield GalleryCategory.findByPk(categoryId);
        if (!category) {
            throw utils_1.ApiError.notFound('Galeri kategorisi bulunamadı');
        }
        const image = yield GalleryImage.create({
            imagePath,
            title,
            description,
            categoryId,
            isVisible: isVisible !== undefined ? isVisible : true
        });
        const createdImage = yield GalleryImage.findByPk(image.id, {
            include: [
                {
                    model: GalleryCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'description']
                }
            ]
        });
        res.status(201).json(utils_1.ApiSuccess.created(createdImage, 'Galeri resmi başarıyla eklendi'));
    }
    catch (error) {
        next(error);
    }
});
exports.createGalleryImage = createGalleryImage;
//# sourceMappingURL=contentController.js.map