// N8N WhatsApp Webhook Types
export interface WhatsAppKey {
    remoteJid: string;
    fromMe: boolean;
    id: string;
}

export interface WhatsAppMessage {
    conversation?: string;
    extendedTextMessage?: {
        text: string;
    };
    imageMessage?: {
        caption?: string;
        url?: string;
    };
    documentMessage?: {
        title?: string;
        fileName?: string;
    };
}

export interface WhatsAppContextInfo {
    expiration: number;
    ephemeralSettingTimestamp: string;
    disappearingMode: {
        initiator: string;
    };
}

export interface WhatsAppWebhookData {
    key: WhatsAppKey;
    pushName: string;
    status: string;
    message: WhatsAppMessage;
    contextInfo: WhatsAppContextInfo;
    messageType: string;
    messageTimestamp: number;
    instanceId: string;
    source: string;
}

export interface WhatsAppWebhookPayload {
    query: Record<string, any>;
    body: {
        event: string;
        instance: string;
        data: WhatsAppWebhookData;
        destination: string;
        date_time: string;
        sender: string;
    };
}

// UI Types
export interface ProcessedWhatsAppMessage {
    id: string;
    sender: string;
    senderName: string;
    content: string;
    messageType: 'text' | 'image' | 'document' | 'unknown';
    timestamp: Date;
    fromMe: boolean;
    status: 'sent' | 'delivered' | 'read' | 'server_ack';
    phoneNumber: string;
}

export interface WhatsAppContact {
    phoneNumber: string;
    name: string;
    lastMessage?: ProcessedWhatsAppMessage;
    unreadCount: number;
    isOnline: boolean;
    profileImage?: string;
}

export interface WhatsAppStats {
    totalMessages: number;
    totalContacts: number;
    todayMessages: number;
    responseRate: number;
    avgResponseTime: string;
    activeChats: number;
}

export interface WhatsAppBotConfig {
    instanceId: string;
    instanceName: string;
    phoneNumber: string;
    isActive: boolean;
    webhookUrl: string;
    lastActivity: Date;
}
