import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import WhatsappRepository from './whatsapp.repository';
import WhatsappService from './whatsapp.service';
import WhatsappController from './whatsapp.controller';

const router = Router();
const repo = new WhatsappRepository();
const service = new WhatsappService(repo);
const controller = new WhatsappController(service);

router.get('/config', requireAuth, controller.getConfig);
router.put('/config', requireAuth, controller.upsertConfig);

router.get('/contacts', requireAuth, controller.listContacts);
router.get('/contacts/:id', requireAuth, controller.getContact);
router.post('/contacts', requireAuth, controller.createContact);

router.get('/contacts/:id/messages', requireAuth, controller.listMessages);
router.post('/contacts/:id/messages', requireAuth, controller.sendMessage);

router.get('/stats', requireAuth, controller.stats);

export default router;


