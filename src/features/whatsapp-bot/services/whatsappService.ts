import { WhatsAppWebhookPayload, ProcessedWhatsAppMessage, WhatsAppContact, WhatsAppStats, WhatsAppBotConfig } from "../types";

// Mock WhatsApp messages data (simulating N8N webhook data)
const mockWhatsAppMessages: ProcessedWhatsAppMessage[] = [
    {
        id: "3FB5FCFDE0661C4E5696",
        sender: "905330873779@s.whatsapp.net",
        senderName: "Kaan",
        content: "Merhaba, emlak konusunda bilgi alabilir miyim?",
        messageType: "text",
        timestamp: new Date("2025-01-09T17:43:38.649Z"),
        fromMe: false,
        status: "delivered",
        phoneNumber: "+90 533 087 37 79"
    },
    {
        id: "3FB5FCFDE0661C4E5697",
        sender: "businesswp@s.whatsapp.net",
        senderName: "Estate Pro Emlak",
        content: "Merhaba! Elbette yardımcı olabilirim. Hangi bölgede emlak arıyorsunuz?",
        messageType: "text",
        timestamp: new Date("2025-01-09T17:45:12.123Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+90 533 087 37 79"
    },
    {
        id: "3FB5FCFDE0661C4E5698",
        sender: "905330873779@s.whatsapp.net",
        senderName: "Kaan",
        content: "Kadıköy tarafında 2+1 daire arıyorum. Bütçem 8M civarında.",
        messageType: "text",
        timestamp: new Date("2025-01-09T17:46:30.456Z"),
        fromMe: false,
        status: "delivered",
        phoneNumber: "+90 533 087 37 79"
    },
    {
        id: "3FB5FCFDE0661C4E5699",
        sender: "905551234567@s.whatsapp.net",
        senderName: "Ayşe Yılmaz",
        content: "Satılık ev fiyatları hakkında bilgi almak istiyorum",
        messageType: "text",
        timestamp: new Date("2025-01-09T16:30:15.789Z"),
        fromMe: false,
        status: "delivered",
        phoneNumber: "+90 555 123 45 67"
    },
    {
        id: "3FB5FCFDE0661C4E5700",
        sender: "businesswp@s.whatsapp.net",
        senderName: "Estate Pro Emlak",
        content: "Merhaba Ayşe Hanım, hangi bölgede ev arıyorsunuz?",
        messageType: "text",
        timestamp: new Date("2025-01-09T16:32:45.321Z"),
        fromMe: true,
        status: "read",
        phoneNumber: "+90 555 123 45 67"
    },
    {
        id: "3FB5FCFDE0661C4E5701",
        sender: "905559876543@s.whatsapp.net",
        senderName: "Mehmet Demir",
        content: "Kiralık daire var mı?",
        messageType: "text",
        timestamp: new Date("2025-01-09T15:20:12.654Z"),
        fromMe: false,
        status: "delivered",
        phoneNumber: "+90 555 987 65 43"
    }
];

const mockContacts: WhatsAppContact[] = [
    {
        phoneNumber: "+90 533 087 37 79",
        name: "Kaan",
        lastMessage: mockWhatsAppMessages[2],
        unreadCount: 1,
        isOnline: true,
        profileImage: undefined
    },
    {
        phoneNumber: "+90 555 123 45 67",
        name: "Ayşe Yılmaz",
        lastMessage: mockWhatsAppMessages[4],
        unreadCount: 0,
        isOnline: false,
        profileImage: undefined
    },
    {
        phoneNumber: "+90 555 987 65 43",
        name: "Mehmet Demir",
        lastMessage: mockWhatsAppMessages[5],
        unreadCount: 1,
        isOnline: false,
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
