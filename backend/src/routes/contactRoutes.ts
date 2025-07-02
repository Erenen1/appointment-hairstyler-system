import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
import {
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
  getContactStats
} from '../controllers/contactController';

const router = Router();

/**
 * @swagger
 * /api/v1/contact/messages:
 *   get:
 *     summary: İletişim mesajlarını listele (Admin)
 *     tags: [Contact]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Sayfa başına öğe sayısı
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Ad, email, konu veya mesajda arama
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [general, appointment, complaint, suggestion, other]
 *         description: Kategori filtresi
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, read, replied, closed]
 *         description: Durum filtresi
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name, subject, category]
 *           default: createdAt
 *         description: Sıralama alanı
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sıralama yönü
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Başlangıç tarihi
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Bitiş tarihi
 *     responses:
 *       200:
 *         description: İletişim mesajları başarıyla getirildi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Erişim reddedildi
 */
router.get('/messages', requireAuth, requireAdmin, getContactMessages);

/**
 * @swagger
 * /api/v1/contact/messages/{id}:
 *   get:
 *     summary: İletişim mesajı detayı (Admin)
 *     tags: [Contact]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mesaj ID
 *     responses:
 *       200:
 *         description: İletişim mesajı başarıyla getirildi
 *       404:
 *         description: Mesaj bulunamadı
 *       401:
 *         description: Yetkilendirme hatası
 */
router.get('/messages/:id', requireAuth, requireAdmin, getContactMessageById);

/**
 * @swagger
 * /api/v1/contact/messages/{id}/status:
 *   put:
 *     summary: İletişim mesajı durumunu güncelle (Admin)
 *     tags: [Contact]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mesaj ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [read, replied, closed]
 *                 description: Yeni durum
 *               adminNotes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Admin notları (opsiyonel)
 *     responses:
 *       200:
 *         description: Mesaj durumu başarıyla güncellendi
 *       400:
 *         description: Geçersiz durum geçişi
 *       404:
 *         description: Mesaj bulunamadı
 */
router.put('/messages/:id/status', requireAuth, requireAdmin, updateContactMessageStatus);

/**
 * @swagger
 * /api/v1/contact/messages/{id}:
 *   delete:
 *     summary: İletişim mesajını sil (Admin)
 *     tags: [Contact]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mesaj ID
 *     responses:
 *       200:
 *         description: Mesaj başarıyla silindi
 *       404:
 *         description: Mesaj bulunamadı
 */
router.delete('/messages/:id', requireAuth, requireAdmin, deleteContactMessage);

/**
 * @swagger
 * /api/v1/contact/stats:
 *   get:
 *     summary: İletişim istatistikleri (Admin Dashboard)
 *     tags: [Contact]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: İstatistikler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalMessages:
 *                           type: integer
 *                         newMessages:
 *                           type: integer
 *                         messagesThisMonth:
 *                           type: integer
 *                         responseRate:
 *                           type: integer
 *                     categoryDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           percentage:
 *                             type: integer
 *                     dailyActivity:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           count:
 *                             type: integer
 */
router.get('/stats', requireAuth, requireAdmin, getContactStats);

export default router; 