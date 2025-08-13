import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import CustomerRepository from './customer.repository';
import CustomerService from './customer.service';
import CustomerController from './customer.controller';

const router = Router();
const repo = new CustomerRepository();
const service = new CustomerService(repo);
const controller = new CustomerController(service);

router.get('/', requireAuth, controller.list);
router.get('/:id', requireAuth, controller.get);
router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

// Preferences
router.get('/:id/preferences', requireAuth, controller.getPreferences);
router.put('/:id/preferences', requireAuth, controller.updatePreferences);

// Viewed properties
router.get('/:id/viewed-properties', requireAuth, controller.getViewedProperties);
router.post('/:id/viewed-properties', requireAuth, controller.addViewedProperty);
router.delete('/:id/viewed-properties/:propertyId', requireAuth, controller.removeViewedProperty);

// Stats
router.get('/stats/summary', requireAuth, controller.getStats);

export default router;


