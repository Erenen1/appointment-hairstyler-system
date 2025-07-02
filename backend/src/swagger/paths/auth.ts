/**
 * @swagger
 * /api/v1/auth/admin/login:
 *   post:
 *     tags:
 *       - Kimlik Doğrulama
 *     summary: Admin girişi
 *     description: Admin kullanıcıları için giriş işlemi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Geçersiz kimlik bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /api/v1/auth/staff/login:
 *   post:
 *     tags:
 *       - Kimlik Doğrulama
 *     summary: Staff girişi
 *     description: Staff kullanıcıları için giriş işlemi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Geçersiz kimlik bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /api/v1/auth/me:
 *   get:
 *     tags:
 *       - Kimlik Doğrulama
 *     summary: Mevcut kullanıcı bilgileri
 *     description: Token ile doğrulanmış kullanıcının bilgilerini getirir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 * 
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Kimlik Doğrulama
 *     summary: Çıkış yap
 *     description: Kullanıcı oturumunu sonlandırır
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Çıkış başarılı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 * 
 * /api/v1/auth/check:
 *   get:
 *     tags:
 *       - Kimlik Doğrulama
 *     summary: Session durumu kontrol
 *     description: Kullanıcının oturum durumunu kontrol eder
 *     responses:
 *       200:
 *         description: Session durumu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 authenticated:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/Admin'
 */ 