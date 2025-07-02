import { Router } from 'express';
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  getAvailableSlots
} from '../controllers/staffController';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Personel yönetimi API'leri
 */

/**
 * @swagger
 * /api/v1/staff:
 *   get:
 *     summary: Tüm personelleri listele
 *     tags: [Staff]
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
 *         description: Sayfa başına kayıt sayısı
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Ad, soyad, uzmanlık veya emailde arama
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Aktif personel filtresi
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [firstName, lastName, createdAt]
 *           default: firstName
 *         description: Sıralama alanı
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sıralama yönü
 *     responses:
 *       200:
 *         description: Personeller başarıyla getirildi
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', getStaff);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   get:
 *     summary: Personel detayını getir
 *     tags: [Staff]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Personel ID
 *     responses:
 *       200:
 *         description: Personel detayları başarıyla getirildi
 *       404:
 *         description: Personel bulunamadı
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.get('/:id', getStaffById);

/**
 * @swagger
 * /api/v1/staff:
 *   post:
 *     summary: Yeni personel oluştur
 *     tags: [Staff]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - specialization
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Personel adı
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Personel soyadı
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email adresi
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 20
 *                 description: Telefon numarası
 *               specialization:
 *                 type: string
 *                 description: Uzmanlık alanı
 *               bio:
 *                 type: string
 *                 description: Biyografi
 *               profileImage:
 *                 type: string
 *                 description: Profil fotoğrafı URL
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Verdiği hizmet ID'leri
 *     responses:
 *       201:
 *         description: Personel başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz veri
 *       409:
 *         description: Email zaten kullanımda
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.post('/', requireAuth, requireAdmin, createStaff);

/**
 * @swagger
 * /api/v1/staff/{id}:
 *   put:
 *     summary: Personel güncelle
 *     tags: [Staff]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Personel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Personel adı
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Personel soyadı
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email adresi
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 20
 *                 description: Telefon numarası
 *               specialization:
 *                 type: string
 *                 description: Uzmanlık alanı
 *               bio:
 *                 type: string
 *                 description: Biyografi
 *               profileImage:
 *                 type: string
 *                 description: Profil fotoğrafı URL
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Verdiği hizmet ID'leri
 *               isActive:
 *                 type: boolean
 *                 description: Aktif durumu
 *     responses:
 *       200:
 *         description: Personel başarıyla güncellendi
 *       400:
 *         description: Geçersiz veri
 *       404:
 *         description: Personel bulunamadı
 *       409:
 *         description: Email zaten kullanımda
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.put('/:id', requireAuth, requireAdmin, updateStaff);

/**
 * @swagger
 * /api/v1/staff/{id}/available-slots:
 *   get:
 *     summary: Personelin müsait saatlerini getir
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Personel ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Tarih (YYYY-MM-DD)
 *       - in: query
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hizmet ID
 *     responses:
 *       200:
 *         description: Müsait saatler başarıyla getirildi
 *       404:
 *         description: Personel veya hizmet bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/:id/available-slots', getAvailableSlots);

export default router; 