import { Router } from "express";
import ContactController from "./contact.controller";
import ContactService from "./contact.service";
import ContactRepository from "./contact.repository";
import { requireBusinessOrAdmin, applyBusinessContext } from "../../middleware/businessAuthMiddleware";

/**
 * İletişim mesajları modülü için route tanımlamaları
 */

// Dependency Injection
const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const contactController = new ContactController(contactService);

const router = Router();

// Business admin erişimi gerektiren rotalar
router.get('/messages', requireBusinessOrAdmin, applyBusinessContext, contactController.getContactMessages.bind(contactController));
router.get('/messages/:id', requireBusinessOrAdmin, applyBusinessContext, contactController.getContactMessageById.bind(contactController));
router.delete('/messages/:id', requireBusinessOrAdmin, applyBusinessContext, contactController.deleteContactMessage.bind(contactController));
router.get('/stats', requireBusinessOrAdmin, applyBusinessContext, contactController.getContactStats.bind(contactController));

// Herkese açık rotalar (businessId gerekebilir - ilerleye business specific olabilir)
router.post('/messages', contactController.createContactMessage.bind(contactController));

export default router; 