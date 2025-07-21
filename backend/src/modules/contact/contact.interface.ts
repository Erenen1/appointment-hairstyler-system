/**
 * İletişim mesajı veri modeli arayüzü
 */
export interface IContactMessage {
    id?: string;
    fullName: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    businessId: string; // İşletme ID (zorunlu)
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * İletişim istatistikleri arayüzü
 */
export interface IContactStats {
    summary: {
        totalMessages: number;
        unreadMessages: number;
        messagesThisMonth: number;
        responseRate: number;
    };
    dailyStats: Array<{
        date: string;
        count: number;
    }>;
} 