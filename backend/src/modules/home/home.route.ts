import { Router } from 'express';
import HomeRepository from './home.repository';
import HomeService from './home.service';
import HomeController from './home.controller';

const router = Router();
const repo = new HomeRepository();
const service = new HomeService(repo);
const controller = new HomeController(service);

router.get('/hero', controller.hero);
router.get('/featured-properties', controller.featured);
router.get('/quick-stats', controller.quickStats);

export default router;


