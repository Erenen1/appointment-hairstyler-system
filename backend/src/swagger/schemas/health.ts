export const healthSchemas = {
  HealthResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Sistem sağlıklı çalışıyor' },
      data: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'OK' },
          timestamp: { type: 'string', format: 'date-time' },
          uptime: { type: 'number', example: 3600.5 },
          environment: { type: 'string', example: 'development' },
          version: { type: 'string', example: 'v18.17.0' },
          platform: { type: 'string', example: 'linux' },
          memory: {
            type: 'object',
            properties: {
              used: { type: 'integer', example: 45 },
              total: { type: 'integer', example: 128 },
              external: { type: 'integer', example: 12 }
            }
          },
          database: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'healthy' },
              responseTime: { type: 'number', example: 15.5 }
            }
          }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },
  ServerInfoResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Server bilgileri getirildi' },
      data: {
        type: 'object',
        properties: {
          application: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Kuaför Backend API' },
              version: { type: 'string', example: '1.0.0' },
              environment: { type: 'string', example: 'development' },
              port: { type: 'integer', example: 3000 },
              startTime: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  },
  LivenessResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'alive' },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },
  ReadinessResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'ready' },
      timestamp: { type: 'string', format: 'date-time' },
      checks: {
        type: 'object',
        properties: {
          database: { type: 'string', example: 'healthy' }
        }
      }
    }
  }
}; 