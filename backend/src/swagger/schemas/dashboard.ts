/**
 * Dashboard API Schemas
 */

export const dashboardSchemas = {
  DashboardStats: {
    type: 'object',
    properties: {
      todaysAppointments: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 8 },
          completed: { type: 'number', example: 3 },
          pending: { type: 'number', example: 4 },
          cancelled: { type: 'number', example: 1 }
        }
      },
      totalCustomers: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 342 },
          newThisMonth: { type: 'number', example: 23 },
          activeCustomers: { type: 'number', example: 156 }
        }
      },
      monthlyRevenue: {
        type: 'object',
        properties: {
          currentMonth: { type: 'number', example: 12500.00 },
          lastMonth: { type: 'number', example: 11200.00 },
          growth: { type: 'number', example: 11.61 }
        }
      },
      completedAppointments: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 124 },
          thisMonth: { type: 'number', example: 45 },
          lastMonth: { type: 'number', example: 38 }
        }
      }
    }
  },

  RevenueChartData: {
    type: 'object',
    properties: {
      labels: {
        type: 'array',
        items: { type: 'string' },
        example: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran']
      },
      datasets: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string', example: 'Aylık Gelir (₺)' },
            data: {
              type: 'array',
              items: { type: 'number' },
              example: [8500, 9200, 11000, 10500, 12300, 12500]
            },
            backgroundColor: { type: 'string', example: 'rgba(99, 102, 241, 0.1)' },
            borderColor: { type: 'string', example: 'rgba(99, 102, 241, 1)' },
            borderWidth: { type: 'number', example: 2 },
            fill: { type: 'boolean', example: true }
          }
        }
      }
    }
  },

  PopularService: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      name: { type: 'string', example: 'Saç Kesimi' },
      appointmentCount: { type: 'number', example: 45 },
      revenue: { type: 'number', example: 11250.00 },
      percentage: { type: 'number', example: 35 }
    }
  },

  RecentAppointment: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 123 },
      customerName: { type: 'string', example: 'Ayşe Demir' },
      serviceName: { type: 'string', example: 'Saç Kesimi' },
      staffName: { type: 'string', example: 'Zeynep Yılmaz' },
      appointmentDate: { type: 'string', example: '15.12.2024' },
      startTime: { type: 'string', example: '14:30' },
      status: { type: 'string', example: 'Tamamlandı' },
      price: { type: 'number', example: 250.00 }
    }
  }
}; 