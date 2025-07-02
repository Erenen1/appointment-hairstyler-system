/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin email adresi
 *           example: admin@kuafor.com
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Admin şifresi
 *           example: 123456
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Giriş başarılı
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT access token
 *             admin:
 *               $ref: '#/components/schemas/Admin'
 *     
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: admin@kuafor.com
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         role:
 *           type: string
 *           enum: [super_admin, admin, staff]
 *           example: admin
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     ForgotPasswordRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Şifre sıfırlama için email adresi
 *           example: admin@kuafor.com
 */ 