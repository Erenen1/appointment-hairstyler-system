/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAdminRequest:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - password
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin email adresi
 *           example: yeni.admin@kuafor.com
 *         firstName:
 *           type: string
 *           description: Ad
 *           example: Ahmet
 *         lastName:
 *           type: string
 *           description: Soyad
 *           example: Yılmaz
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Şifre
 *           example: 123456
 *         role:
 *           type: string
 *           enum: [super_admin, admin, staff]
 *           description: Admin rolü
 *           example: admin
 *     
 *     UpdateAdminRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin email adresi
 *           example: guncellenen.admin@kuafor.com
 *         firstName:
 *           type: string
 *           description: Ad
 *           example: Mehmet
 *         lastName:
 *           type: string
 *           description: Soyad
 *           example: Demir
 *         role:
 *           type: string
 *           enum: [super_admin, admin, staff]
 *           description: Admin rolü
 *           example: admin
 *         isActive:
 *           type: boolean
 *           description: Aktif durumu
 *           example: true
 *     
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Mevcut şifre (kendi şifresini değiştirirken gerekli)
 *           example: eskiSifre123
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           description: Yeni şifre
 *           example: yeniSifre123
 */ 