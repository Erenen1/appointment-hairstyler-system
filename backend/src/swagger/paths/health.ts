/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Sistem
 *     summary: Sistem durumu
 *     description: API'nin çalışma durumunu kontrol eder
 *     responses:
 *       200:
 *         description: Sistem çalışıyor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 1234.567
 * 
 * /health/database:
 *   get:
 *     tags:
 *       - Sistem
 *     summary: Database durumu
 *     description: Database bağlantısının durumunu kontrol eder
 *     responses:
 *       200:
 *         description: Database çalışıyor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 database:
 *                   type: object
 *                   properties:
 *                     connected:
 *                       type: boolean
 *                       example: true
 *                     name:
 *                       type: string
 *                       example: kuafor_db
 * 
 * /health/server:
 *   get:
 *     tags:
 *       - Sistem
 *     summary: Server bilgileri
 *     description: Server hakkında detaylı bilgi verir
 *     responses:
 *       200:
 *         description: Server bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 server:
 *                   type: object
 *                   properties:
 *                     nodeVersion:
 *                       type: string
 *                       example: v18.17.0
 *                     platform:
 *                       type: string
 *                       example: linux
 *                     memory:
 *                       type: object
 *                       properties:
 *                         used:
 *                           type: number
 *                         total:
 *                           type: number
 * 
 * /health/liveness:
 *   get:
 *     tags:
 *       - Sistem
 *     summary: Liveness probe
 *     description: Kubernetes liveness probe endpoint
 *     responses:
 *       200:
 *         description: Uygulama canlı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 * 
 * /health/readiness:
 *   get:
 *     tags:
 *       - Sistem
 *     summary: Readiness probe
 *     description: Kubernetes readiness probe endpoint
 *     responses:
 *       200:
 *         description: Uygulama hazır
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 ready:
 *                   type: boolean
 *                   example: true
 */ 