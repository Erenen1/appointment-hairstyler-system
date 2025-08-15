import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import AppointmentsRepository from './appointments.repository';
import AppointmentsService from './appointments.service';
import AppointmentsController from './appointments.controller';

const router = Router();
const repo = new AppointmentsRepository();
const service = new AppointmentsService(repo);
const controller = new AppointmentsController(service);

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.get);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

// history
router.get('/:id/history', requireAuth, controller.getHistory);
router.post('/:id/history', requireAuth, controller.addHistory);

// helpers
router.get('/helpers/services', requireAuth, controller.services);
router.get('/helpers/staff', requireAuth, controller.staff);
router.get('/helpers/statuses', requireAuth, controller.statuses);

export default router;


