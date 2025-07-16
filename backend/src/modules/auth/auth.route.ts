import { Router } from "express";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import AuthRepository from "./auth.repository";
import { requireAdmin } from "../../middleware/authMiddleware";

/**
 * Auth modülü için route tanımlamaları
 */

// Dependency Injection
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const router = Router();

// Routes
router.post('/login', authController.login.bind(authController));
router.get('/profile', requireAdmin, authController.getProfile.bind(authController));

export default router;