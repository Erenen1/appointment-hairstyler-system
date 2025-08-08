import { Router } from "express";
import CategoryController from "./category.controller";
import CategoryService from "./category.service";
import CategoryRepository from "./category.repository";
import { requireBusiness } from "../../middleware/businessAuthMiddleware";


const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

router.get('/',  categoryController.getAllCategories.bind(categoryController));
router.get('/:id',  categoryController.getCategoryById.bind(categoryController));
router.post('/', requireBusiness, categoryController.createCategory.bind(categoryController));
router.put('/:id', requireBusiness, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', requireBusiness, categoryController.deleteCategory.bind(categoryController));

export default router; 