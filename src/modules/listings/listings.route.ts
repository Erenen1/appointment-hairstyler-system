import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import ListingsRepository from './listings.repository';
import ListingsService from './listings.service';
import ListingsController from './listings.controller';

const router = Router();
const repo = new ListingsRepository();
const service = new ListingsService(repo);
const controller = new ListingsController(service);

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.get);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

router.post('/:id/images', requireAuth, controller.addImages);
router.put('/:id/tags', requireAuth, controller.setTags);
router.put('/:id/amenities', requireAuth, controller.setAmenities);

router.get('/:id/events', requireAuth, controller.listEvents);
router.post('/:id/events', requireAuth, controller.addEvent);

export default router;


