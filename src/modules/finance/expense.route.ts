import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import ExpenseRepository from './expense.repository';
import ExpenseService from './expense.service';
import ExpenseController from './expense.controller';

const router = Router();
const repo = new ExpenseRepository();
const service = new ExpenseService(repo);
const controller = new ExpenseController(service);

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.get);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

// categories
router.get('/categories', requireAuth, controller.listCategories);
router.post('/categories', requireAuth, controller.createCategory);
router.put('/categories/:id', requireAuth, controller.updateCategory);
router.delete('/categories/:id', requireAuth, controller.removeCategory);

export default router;


