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
const index_1 = __importDefault(require("../models/index"));
const { GalleryImage, GalleryCategory } = index_1.default;
const getGalleryImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, search, categoryId, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
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
            whereConditions.isActive = isActive === 'true';
        }
        const offset = (Number(page) - 1) * Number(limit);
        const { count, rows } = yield GalleryImage.findAndCountAll({
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
        res.json(utils_1.ApiSuccess.list(rows, paginationInfo, 'Galeri resimleri başarıyla getirildi'));
    }
    catch (error) {
        next(error);
    }
});
exports.getGalleryImages = getGalleryImages;
const createGalleryImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imagePath, title, description, categoryId, isVisible } = req.body;
        if (!imagePath || !categoryId) {
            throw utils_1.ApiError.badRequest('Resim yolu ve kategori ID zorunludur');
        }
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