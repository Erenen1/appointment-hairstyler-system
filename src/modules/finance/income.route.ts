import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import IncomeRepository from './income.repository';
import IncomeService from './income.service';
import IncomeController from './income.controller';

const router = Router();
const repo = new IncomeRepository();
const service = new IncomeService(repo);
const controller = new IncomeController(service);

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


