"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardSchemas = void 0;
exports.dashboardSchemas = {
    DashboardSummary: {
        type: 'object',
        properties: {
            totalAppointments: { type: 'integer', description: 'Toplam randevu sayısı' },
            pendingAppointments: { type: 'integer', description: 'Bekleyen randevu sayısı' },
            confirmedAppointments: { type: 'integer', description: 'Onaylanmış randevu sayısı' },
            completedAppointments: { type: 'integer', description: 'Tamamlanmış randevu sayısı' },
            cancelledAppointments: { type: 'integer', description: 'İptal edilmiş randevu sayısı' },
            totalCustomers: { type: 'integer', description: 'Toplam müşteri sayısı' },
            totalStaff: { type: 'integer', description: 'Toplam personel sayısı' },
            totalServices: { type: 'integer', description: 'Toplam hizmet sayısı' },
            totalRevenue: { type: 'number', format: 'float', description: 'Toplam gelir' },
            upcomingAppointments: {
                type: 'array',
                items: { $ref: '#/components/schemas/Appointment' },
                description: 'Yaklaşan randevuların listesi (yalnızca ilk 5)',
            },
            recentContactMessages: {
                type: 'array',
                items: { $ref: '#/components/schemas/ContactMessage' },
                description: 'Son iletişim mesajlarının listesi (yalnızca ilk 5)',
            },
        },
    },
    RevenueByMonth: {
        type: 'object',
        properties: {
            month: { type: 'string', description: 'Ay (örn: 2024-01)' },
            revenue: { type: 'number', format: 'float', description: 'Gelir miktarı' },
        },
    },
    AppointmentsByStatus: {
        type: 'object',
        properties: {
            status: { type: 'string', description: 'Randevu durumu' },
            count: { type: 'integer', description: 'Bu durumdaki randevu sayısı' },
        },
    },
    DashboardStatsResponse: {
        type: 'object',
        properties: {
            summary: { $ref: '#/components/schemas/DashboardSummary' },
            revenueByMonth: {
                type: 'array',
                items: { $ref: '#/components/schemas/RevenueByMonth' },
            },
            appointmentsByStatus: {
                type: 'array',
                items: { $ref: '#/components/schemas/AppointmentsByStatus' },
            },
        },
    },
};
//# sourceMappingURL=dashboard.js.map