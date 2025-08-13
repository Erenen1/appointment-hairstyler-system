import { Router } from 'express';
import AuthRepository from './auth.repository';
import AuthService from './auth.service';
import AuthController from './auth.controller';

const router = Router();
const repo = new AuthRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/password-reset/request', controller.requestPasswordReset);
router.post('/password-reset/confirm', controller.confirmPasswordReset);

export default router;


