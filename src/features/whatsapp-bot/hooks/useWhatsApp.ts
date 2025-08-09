import { useState, useEffect, useMemo } from "react";
import { ProcessedWhatsAppMessage, WhatsAppContact, WhatsAppStats, WhatsAppBotConfig } from "../types";
import { whatsappService } from "../services/whatsappService";

export const useWhatsApp = () => {
    const [messages, setMessages] = useState<ProcessedWhatsAppMessage[]>([]);
    const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
    const [stats, setStats] = useState<WhatsAppStats | null>(null);
    const [botConfig, setBotConfig] = useState<WhatsAppBotConfig | null>(null);
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");
    const [contactFilter, setContactFilter] = useState<string>("all");

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [messagesData, contactsData, statsData, configData] = await Promise.all([
                    whatsappService.getAllMessages(),
                    whatsappService.getContacts(),
                    whatsappService.getStats(),
                    whatsappService.getBotConfig()
                ]);

                setMessages(messagesData);
                setContacts(contactsData);
                setStats(statsData);
                setBotConfig(configData);
            } catch (error) {
                console.error("WhatsApp data loading error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Get filtered messages
    const filteredMessages = useMemo(() => {
        let filtered = messages;

        // Filter by selected contact
        if (selectedContact) {
            filtered = filtered.filter(msg => msg.phoneNumber === selectedContact);
        }

        // Filter by contact filter
        if (contactFilter !== "all") {
            if (contactFilter === "unread") {
                const unreadContacts = contacts.filter(c => c.unreadCount > 0).map(c => c.phoneNumber);
                filtered = filtered.filter(msg => unreadContacts.includes(msg.phoneNumber));
            } else if (contactFilter === "today") {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                filtered = filtered.filter(msg => msg.timestamp >= today);
            }
        }

        // Global filter (search)
        if (globalFilter) {
            const searchTerm = globalFilter.toLowerCase();
            filtered = filtered.filter(msg =>
                msg.content.toLowerCase().includes(searchTerm) ||
                msg.senderName.toLowerCase().includes(searchTerm) ||
                msg.phoneNumber.includes(searchTerm)
            );
        }

        return filtered;
    }, [messages, selectedContact, contactFilter, globalFilter, contacts]);

    // Get filtered contacts
    const filteredContacts = useMemo(() => {
        let filtered = contacts;

        if (globalFilter) {
            const searchTerm = globalFilter.toLowerCase();
            filtered = filtered.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm) ||
                contact.phoneNumber.includes(searchTerm)
            );
        }

        return filtered;
    }, [contacts, globalFilter]);

    // Get messages for selected contact
    const selectedContactMessages = useMemo(() => {
        if (!selectedContact) return [];
        return messages
            .filter(msg => msg.phoneNumber === selectedContact)
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [messages, selectedContact]);

    // Actions
    const loadContactMessages = async (phoneNumber: string) => {
        try {
            const contactMessages = await whatsappService.getMessagesByContact(phoneNumber);
            // Update messages with fresh data for this contact
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.phoneNumber !== phoneNumber);
                return [...filtered, ...contactMessages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            });
            setSelectedContact(phoneNumber);
        } catch (error) {
            console.error("Error loading contact messages:", error);
        }
    };

    const deleteMessage = async (messageId: string) => {
        try {
            const success = await whatsappService.deleteMessage(messageId);
            if (success) {
                setMessages(prev => prev.filter(msg => msg.id !== messageId));
                // Update stats
                const newStats = await whatsappService.getStats();
                setStats(newStats);
            }
            return success;
        } catch (error) {
            console.error("Error deleting message:", error);
            return false;
        }
    };

    const markContactAsRead = async (phoneNumber: string) => {
        try {
            const success = await whatsappService.markAsRead(phoneNumber);
            if (success) {
                setContacts(prev => prev.map(contact =>
                    contact.phoneNumber === phoneNumber
                        ? { ...contact, unreadCount: 0 }
                        : contact
                ));
                // Update stats
                const newStats = await whatsappService.getStats();
                setStats(newStats);
            }
            return success;
        } catch (error) {
            console.error("Error marking as read:", error);
            return false;
        }
    };

    const refreshData = async () => {
        setLoading(true);
        try {
            const [messagesData, contactsData, statsData] = await Promise.all([
                whatsappService.getAllMessages(),
                whatsappService.getContacts(),
                whatsappService.getStats()
            ]);

            setMessages(messagesData);
            setContacts(contactsData);
            setStats(statsData);
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        // Data
        messages: filteredMessages,
        contacts: filteredContacts,
        stats,
        botConfig,
        selectedContact,
        selectedContactMessages,
        loading,

        // Filters
        globalFilter,
        setGlobalFilter,
        contactFilter,
        setContactFilter,

        // Actions
        setSelectedContact,
        loadContactMessages,
        deleteMessage,
        markContactAsRead,
        refreshData
    };
};
