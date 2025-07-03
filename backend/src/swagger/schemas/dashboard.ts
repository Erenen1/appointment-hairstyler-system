export const dashboardSchemas = {
  DashboardStats: {
    type: 'object',
    properties: {
      todaysAppointments: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 8 }
        }
      },
      totalCustomers: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 450 },
          newThisMonth: { type: 'number', example: 15 },
          activeCustomers: { type: 'number', example: 120 }
        }
      },
      monthlyRevenue: {
        type: 'object',
        properties: {
          currentMonth: { type: 'number', example: 45000 },
          lastMonth: { type: 'number', example: 38000 },
          growth: { type: 'number', example: 18.42 }
        }
      },
      completedAppointments: {
        type: 'object',
        properties: {
          total: { type: 'number', example: 2150 },
          thisMonth: { type: 'number', example: 180 },
          lastMonth: { type: 'number', example: 152 }
        }
      }
    }
  },
  RevenueChart: {
    type: 'object',
    properties: {
      labels: {
        type: 'array',
        items: { type: 'string' },
        example: ['Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım']
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
              example: [38000, 42000, 35000, 47000, 41000, 45000]
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
      title: { type: 'string', example: 'Saç Kesimi' },
      price: { type: 'number', example: 250 },
      appointmentCount: { type: 'number', example: 85 }
    }
  },
  RecentAppointment: {
    type: 'object',
    properties: {
      id: { type: 'number', example: 123 },
      customer: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          fullName: { type: 'string', example: 'Ayşe Demir' },
          phone: { type: 'string', example: '+90 555 123 4567' }
        }
      },
      service: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Saç Kesimi' }
        }
      },
      staff: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          fullName: { type: 'string', example: 'Zeynep Yılmaz' }
        }
      },
      appointmentDate: { type: 'string', format: 'date', example: '2024-12-15' },
      startTime: { type: 'string', example: '14:30' },
      endTime: { type: 'string', example: '15:30' },
      price: { type: 'number', example: 250 },
      notes: { type: 'string', example: 'Özel istek notları' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  }
}; 