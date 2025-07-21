import config from '../../config/env';

export const dashboardPaths = {
  [`${config.API_PREFIX}/dashboard/summary`]: {
    get: {
      tags: ['Dashboard'],
      summary: 'Kontrol Paneli Özeti',
      description: 'Genel kontrol paneli özet istatistiklerini getirir.',
      responses: {
        '200': {
          description: 'Kontrol paneli özeti başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DashboardSummary',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
  [`${config.API_PREFIX}/dashboard/stats`]: {
    get: {
      tags: ['Dashboard'],
      summary: 'Kontrol Paneli İstatistikleri',
      description: 'Detaylı kontrol paneli istatistiklerini (aylık gelir, randevu durumu vb.) getirir.',
      responses: {
        '200': {
          description: 'Kontrol paneli istatistikleri başarıyla getirildi.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DashboardStatsResponse',
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/InternalServerError' },
      },
    },
  },
}; 