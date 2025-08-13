import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import SettingsRepository from './settings.repository';
import SettingsService from './settings.service';
import SettingsController from './settings.controller';

const router = Router();
const repo = new SettingsRepository();
const service = new SettingsService(repo);
const controller = new SettingsController(service);

router.get('/business', requireAuth, controller.getBusiness);
router.put('/business', requireAuth, controller.upsertBusiness);

router.get('/notifications', requireAuth, controller.getNotification);
router.put('/notifications', requireAuth, controller.upsertNotification);

router.get('/profile', requireAuth, controller.getProfile);
router.put('/profile', requireAuth, controller.updateProfile);

export default router;


