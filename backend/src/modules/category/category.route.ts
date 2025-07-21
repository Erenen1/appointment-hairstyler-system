import { Router } from "express";
import CategoryController from "./category.controller";
import CategoryService from "./category.service";
import CategoryRepository from "./category.repository";
import { requireBusinessOrAdmin, applyBusinessContext } from "../../middleware/businessAuthMiddleware";

/**
 * Kategori modülü için route tanımlamaları
 */

// Dependency Injection
const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

// Kategori rotaları (Business context gerektirir)
router.get('/', requireBusinessOrAdmin, applyBusinessContext, categoryController.getAllCategories.bind(categoryController));
router.get('/:id', requireBusinessOrAdmin, applyBusinessContext, categoryController.getCategoryById.bind(categoryController));
router.post('/', requireBusinessOrAdmin, applyBusinessContext, categoryController.createCategory.bind(categoryController));
router.put('/:id', requireBusinessOrAdmin, applyBusinessContext, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', requireBusinessOrAdmin, applyBusinessContext, categoryController.deleteCategory.bind(categoryController));

export default router; 