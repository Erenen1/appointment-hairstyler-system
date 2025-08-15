import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import CurrentAccountRepository from './current-account.repository';
import CurrentAccountService from './current-account.service';
import CurrentAccountController from './current-account.controller';

const router = Router();
const repo = new CurrentAccountRepository();
const service = new CurrentAccountService(repo);
const controller = new CurrentAccountController(service);

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.get);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

router.get('/:id/transactions', requireAuth, controller.listTransactions);
router.post('/:id/transactions', requireAuth, controller.addTransaction);
router.delete('/transactions/:txId', requireAuth, controller.removeTransaction);

export default router;


