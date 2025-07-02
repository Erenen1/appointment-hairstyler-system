import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
import {
  // Galeri API'leri
  getGalleryImages,
  createGalleryImage
} from '../controllers/contentController';

const router = Router();

// ==================== GALLERY ROUTES ====================

/**
 * @swagger
 * /api/v1/content/gallery:
 *   get:
 *     summary: Galeri resimlerini listele
 *     tags: [Content]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Galeri resimleri başarıyla getirildi
 */
router.get('/gallery', getGalleryImages);

/**
 * @swagger
 * /api/v1/content/gallery:
 *   post:
 *     summary: Yeni galeri resmi ekle
 *     tags: [Content]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *               - categoryId
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               title:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *               categoryId:
 *                 type: integer
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Galeri resmi başarıyla eklendi
 *       400:
 *         description: Geçersiz veri
 */
router.post('/gallery', requireAuth, requireAdmin, createGalleryImage);

export default router; 