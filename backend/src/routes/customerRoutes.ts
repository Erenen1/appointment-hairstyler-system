import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController';
import { requireAuth, requireStaffOrAdmin } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Müşteri yönetimi API'leri
 */

/**
 * @swagger
 * /api/v1/customers:
 *   get:
 *     summary: Tüm müşterileri listele
 *     tags: [Customers]
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
 *         description: Ad, soyad, email veya telefonda arama
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, lastVisit, totalSpent]
 *           default: createdAt
 *         description: Sıralama alanı
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sıralama yönü
 *     responses:
 *       200:
 *         description: Müşteriler başarıyla getirildi
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.get('/', requireAuth, requireStaffOrAdmin, getCustomers);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Müşteri detayını getir
 *     tags: [Customers]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Müşteri ID
 *     responses:
 *       200:
 *         description: Müşteri detayları başarıyla getirildi
 *       404:
 *         description: Müşteri bulunamadı
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.get('/:id', requireAuth, requireStaffOrAdmin, getCustomerById);

/**
 * @swagger
 * /api/v1/customers:
 *   post:
 *     summary: Yeni müşteri oluştur
 *     tags: [Customers]
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
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Müşteri adı
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Müşteri soyadı
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email adresi
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 20
 *                 description: Telefon numarası
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Müşteri notları
 *     responses:
 *       201:
 *         description: Müşteri başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz veri
 *       409:
 *         description: Email veya telefon zaten kullanımda
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.post('/', requireAuth, requireStaffOrAdmin, createCustomer);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   put:
 *     summary: Müşteri güncelle
 *     tags: [Customers]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Müşteri ID
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
 *                 description: Müşteri adı
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: Müşteri soyadı
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email adresi
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 20
 *                 description: Telefon numarası
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Müşteri notları
 *     responses:
 *       200:
 *         description: Müşteri başarıyla güncellendi
 *       400:
 *         description: Geçersiz veri
 *       404:
 *         description: Müşteri bulunamadı
 *       409:
 *         description: Email veya telefon zaten kullanımda
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.put('/:id', requireAuth, requireStaffOrAdmin, updateCustomer);

/**
 * @swagger
 * /api/v1/customers/{id}:
 *   delete:
 *     summary: Müşteri sil
 *     tags: [Customers]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Müşteri ID
 *     responses:
 *       200:
 *         description: Müşteri başarıyla silindi
 *       400:
 *         description: Müşteriye ait aktif randevular var
 *       404:
 *         description: Müşteri bulunamadı
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.delete('/:id', requireAuth, requireStaffOrAdmin, deleteCustomer);

export default router; 