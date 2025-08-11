import { WhatsAppWebhookPayload, ProcessedWhatsAppMessage, WhatsAppContact, WhatsAppStats, WhatsAppBotConfig } from "../types";

// Mock WhatsApp messages data (simulating N8N webhook data)
const mockWhatsAppMessages: ProcessedWhatsAppMessage[] = [
    {
        id: "msg1",
        sender: "+905551234567",
        senderName: "Ahmet Yılmaz",
        content: "Merhaba, ev ilanınız hakkında bilgi alabilir miyim?",
        messageType: "text",
        timestamp: new Date("2024-01-15T10:30:00.000Z"),
        fromMe: false,
        status: "delivered",
        phoneNumber: "+905551234567"
    },
    {
        id: "msg2",
        sender: "+905559876543",
        senderName: "Fatma Demir",
        content: "Teşekkürler, yarın görüşelim",
        messageType: "text",
        timestamp: new Date("2024-01-15T09:15:00.000Z"),
        fromMe: false,
        status: "read",
        phoneNumber: "+905559876543"
    },
    {
        id: "msg16",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Harika! Yarın saat 14:00'te ofisimizde görüşelim. Size tüm ev seçeneklerini gösterebilirim. Adres: Kadıköy, Rıhtım Caddesi No:45.",
        messageType: "text",
        timestamp: new Date("2024-01-15T09:16:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905559876543"
    },
    {
        id: "msg17",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Görüşme öncesi hangi bölge ve özelliklerde ev aradığınızı belirtirseniz, size en uygun seçenekleri hazırlayabilirim.",
        messageType: "text",
        timestamp: new Date("2024-01-15T09:17:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905559876543"
    },
    {
        id: "msg3",
        sender: "+905553456789",
        senderName: "Mehmet Kaya",
        content: "Fiyat konusunda pazarlık yapabilir miyiz?",
        messageType: "text",
        timestamp: new Date("2024-01-15T11:45:00.000Z"),
        fromMe: false,
        status: "delivered",
        phoneNumber: "+905553456789"
    },
    {
        id: "msg14",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Merhaba Mehmet Bey! Elbette fiyat konusunda esnek olabiliriz. Hangi ev hakkında konuşuyoruz? Size en uygun fiyatı bulalım.",
        messageType: "text",
        timestamp: new Date("2024-01-15T11:46:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905553456789"
    },
    {
        id: "msg15",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Ayrıca kredi imkanları ve ödeme planları da mevcut. Size en uygun seçeneği sunabiliriz. Detaylı görüşme için ofisimize gelebilir misiniz?",
        messageType: "text",
        timestamp: new Date("2024-01-15T11:47:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905553456789"
    },
    {
        id: "msg4",
        sender: "+905557890123",
        senderName: "Ayşe Özkan",
        content: "Emlak ofisiniz nerede?",
        messageType: "text",
        timestamp: new Date("2024-01-15T08:20:00.000Z"),
        fromMe: false,
        status: "read",
        phoneNumber: "+905557890123"
    },
    {
        id: "msg12",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Merhaba Ayşe Hanım! Ofisimiz Kadıköy'de, Rıhtım Caddesi No:45'te bulunuyor. Metro ve otobüs duraklarına çok yakın.",
        messageType: "text",
        timestamp: new Date("2024-01-15T08:21:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905557890123"
    },
    {
        id: "msg13",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Çalışma saatlerimiz: Hafta içi 09:00-18:00, Cumartesi 10:00-16:00. Pazar günü kapalıyız. Randevu almak isterseniz size yardımcı olabilirim.",
        messageType: "text",
        timestamp: new Date("2024-01-15T08:22:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905557890123"
    },
    {
        id: "msg5",
        sender: "+905551112223",
        senderName: "Ali Veli",
        content: "Kredi imkanları hakkında bilgi verir misiniz?",
        messageType: "text",
        timestamp: new Date("2024-01-15T12:00:00.000Z"),
        fromMe: false,
        status: "delivered",
        phoneNumber: "+905551112223"
    },
    {
        id: "msg10",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Merhaba Ali Bey! Kredi imkanları konusunda size yardımcı olabilirim. Hangi tür kredi düşünüyorsunuz? Konut kredisi mi yoksa iş kredisi mi?",
        messageType: "text",
        timestamp: new Date("2024-01-15T12:01:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905551112223"
    },
    {
        id: "msg11",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Konut kredisi için gerekli belgeler: Kimlik fotokopisi, maaş bordrosu, banka hesap ekstresi. Size en uygun bankayı bulabiliriz.",
        messageType: "text",
        timestamp: new Date("2024-01-15T12:02:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905551112223"
    },
    {
        id: "msg6",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Merhaba! Size nasıl yardımcı olabilirim? Emlak konusunda hangi bilgiyi arıyorsunuz?",
        messageType: "text",
        timestamp: new Date("2024-01-15T10:31:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905551234567"
    },
    {
        id: "msg7",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Tabii ki! Hangi ev ilanı hakkında bilgi almak istiyorsunuz? Bölge, oda sayısı ve bütçe bilgilerinizi paylaşırsanız size en uygun seçenekleri sunabilirim.",
        messageType: "text",
        timestamp: new Date("2024-01-15T10:32:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905551234567"
    },
    {
        id: "msg8",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Kadıköy bölgesinde 2+1 daire arayışınız için size yardımcı olabilirim. 8M bütçe ile bu bölgede güzel seçenekler bulunuyor. Detaylı bilgi için ofisimize gelebilir veya randevu alabilirsiniz.",
        messageType: "text",
        timestamp: new Date("2024-01-15T10:33:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905551234567"
    },
    {
        id: "msg9",
        sender: "AI Bot",
        senderName: "AI Bot",
        content: "Ayrıca kredi imkanları konusunda da size yardımcı olabilirim. Bankalarla anlaşmalarımız var ve en uygun faiz oranlarını bulabiliriz.",
        messageType: "text",
        timestamp: new Date("2024-01-15T10:34:00.000Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+905551234567"
    }
];

const mockContacts: WhatsAppContact[] = [
    {
        phoneNumber: "+905551234567",
        name: "Ahmet Yılmaz",
        lastMessage: mockWhatsAppMessages[0],
        unreadCount: 3,
        isOnline: true,
        profileImage: undefined
    },
    {
        phoneNumber: "+905559876543",
        name: "Fatma Demir",
        lastMessage: mockWhatsAppMessages[1],
        unreadCount: 0,
        isOnline: false,
        profileImage: undefined
    },
    {
        phoneNumber: "+905553456789",
        name: "Mehmet Kaya",
        lastMessage: mockWhatsAppMessages[2],
        unreadCount: 1,
        isOnline: true,
        profileImage: undefined
    },
    {
        phoneNumber: "+905557890123",
        name: "Ayşe Özkan",
        lastMessage: mockWhatsAppMessages[3],
        unreadCount: 0,
        isOnline: false,
        profileImage: undefined
    },
    {
        phoneNumber: "+905551112223",
        name: "Ali Veli",
        lastMessage: mockWhatsAppMessages[4],
        unreadCount: 2,
        isOnline: true,
        profileImage: undefined
    }
];

const mockBotConfig: WhatsAppBotConfig = {
    instanceId: "5a2e6afb-b457-4f7c-94f2-081fae0450ad",
    instanceName: "businesswp",
    phoneNumber: "+90 533 XXX XX XX",
    isActive: true,
    webhookUrl: "http://n8n.erencelik.info/webhook-test/09ce51d4-50d6-43d0-9317-ae01def16f90",
    lastActivity: new Date("2025-01-09T17:46:30.456Z")
};

// Service functions
export const whatsappService = {
    // Get all messages
    getAllMessages: async (): Promise<ProcessedWhatsAppMessage[]> => {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockWhatsAppMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    },

    // Get messages for specific contact
    getMessagesByContact: async (phoneNumber: string): Promise<ProcessedWhatsAppMessage[]> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockWhatsAppMessages
            .filter(msg => msg.phoneNumber === phoneNumber)
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    },

    // Get all contacts
    getContacts: async (): Promise<WhatsAppContact[]> => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return mockContacts.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
        });
    },

    // Get WhatsApp statistics
    getStats: async (): Promise<WhatsAppStats> => {
        await new Promise(resolve => setTimeout(resolve, 200));

        const totalMessages = mockWhatsAppMessages.length;
        const totalContacts = mockContacts.length;

        // Today's messages (last 24 hours)
        const today = new Date();
        const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
        const todayMessages = mockWhatsAppMessages.filter(msg => msg.timestamp > yesterday).length;

        // Active chats (contacts with unread messages)
        const activeChats = mockContacts.filter(contact => contact.unreadCount > 0).length;

        return {
            totalMessages,
            totalContacts,
            todayMessages,
            responseRate: 85.5, // Mock percentage
            avgResponseTime: "2.5 dk",
            activeChats
        };
    },

    // Get bot configuration
    getBotConfig: async (): Promise<WhatsAppBotConfig> => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockBotConfig;
    },

    // Delete message
    deleteMessage: async (messageId: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = mockWhatsAppMessages.findIndex(msg => msg.id === messageId);
        if (index > -1) {
            mockWhatsAppMessages.splice(index, 1);
            return true;
        }
        return false;
    },

    // Mark messages as read for a contact
    markAsRead: async (phoneNumber: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const contact = mockContacts.find(c => c.phoneNumber === phoneNumber);
        if (contact) {
            contact.unreadCount = 0;
            return true;
        }
        return false;
    },

    // Process N8N webhook data (for future real implementation)
    processWebhookData: (payload: WhatsAppWebhookPayload): ProcessedWhatsAppMessage => {
        const { data } = payload.body;
        const messageContent = data.message.conversation ||
            data.message.extendedTextMessage?.text ||
            data.message.imageMessage?.caption ||
            "Medya mesajı";

        return {
            id: data.key.id,
            sender: data.key.remoteJid,
            senderName: data.pushName,
            content: messageContent,
            messageType: data.messageType as any,
            timestamp: new Date(data.messageTimestamp * 1000),
            fromMe: data.key.fromMe,
            status: data.status.toLowerCase() as any,
            phoneNumber: payload.body.sender.replace("@s.whatsapp.net", "").replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 $2 $3 $4 $5")
        };
    }
};
