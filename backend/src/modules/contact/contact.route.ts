import { Router } from "express";
import ContactController from "./contact.controller";
import ContactService from "./contact.service";
import ContactRepository from "./contact.repository";
import { requireAdmin } from "../../middleware/authMiddleware";

/**
 * İletişim mesajları modülü için route tanımlamaları
 */

// Dependency Injection
const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const contactController = new ContactController(contactService);

const router = Router();

// Admin erişimi gerektiren rotalar
router.get('/messages', requireAdmin, contactController.getContactMessages.bind(contactController));
router.get('/messages/:id', requireAdmin, contactController.getContactMessageById.bind(contactController));
router.delete('/messages/:id', requireAdmin, contactController.deleteContactMessage.bind(contactController));
router.get('/stats', requireAdmin, contactController.getContactStats.bind(contactController));

// Herkese açık rotalar
router.post('/messages', contactController.createContactMessage.bind(contactController));

export default router; 