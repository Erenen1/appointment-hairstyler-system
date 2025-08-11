"use client";

import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { ProcessedWhatsAppMessage } from "../types";

interface MessageListProps {
    messages: ProcessedWhatsAppMessage[];
    selectedContact: string | null;
    loading?: boolean;
}

export const MessageList = ({
    messages,
    selectedContact,
    loading = false
}: MessageListProps) => {

    const formatMessageTime = (date: Date) => {
        return date.toLocaleString("tr-TR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getMessageTypeIcon = (type: string) => {
        switch (type) {
            case 'image': return 'pi pi-image';
            case 'document': return 'pi pi-file';
            default: return 'pi pi-comment';
        }
    };

    const getStatusIcon = (status: string, fromMe: boolean) => {
        if (!fromMe) return null;

        switch (status) {
            case 'sent': return 'pi pi-check text-green-100';
            case 'delivered': return 'pi pi-check-circle text-green-100';
            case 'read': return 'pi pi-check-circle text-blue-200';
            default: return 'pi pi-clock text-green-100';
        }
    };

    if (loading) {
        return (
            <Card className="bg-white rounded-xl border-0 h-full">
                <div className="p-6">
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                    <div className="h-16 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    const title = selectedContact
        ? `Mesajlar - ${messages.find(m => m.phoneNumber === selectedContact)?.senderName || selectedContact}`
        : "Tüm Mesajlar";

    return (
        <Card className="bg-white rounded-xl border-0 h-full flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                    {messages.length} mesaj • AI Bot konuşma geçmişi
                </p>
            </div>

            <div className="flex-1 overflow-hidden">
                {messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 px-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-comments text-3xl text-gray-400"></i>
                        </div>
                        <p className="text-gray-500 font-medium mb-2">
                            {selectedContact ? "Bu kişi ile henüz mesaj geçmişi yok" : "Henüz mesaj bulunmuyor"}
                        </p>
                        <p className="text-sm text-gray-400">
                            {selectedContact ? "İlk mesajı göndererek konuşmayı başlatın" : "Yeni mesajlar geldiğinde burada görünecek"}
                        </p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {messages.map((message) => (
                            <div key={message.id} className="group">
                                <div className={`flex gap-4 ${message.fromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <Avatar
                                            image={message.fromMe ? undefined : undefined}
                                            icon={message.fromMe ? "pi pi-robot" : "pi pi-user"}
                                            size="normal"
                                            shape="circle"
                                            className="border border-gray-200"
                                            style={{
                                                backgroundColor: message.fromMe ? '#10b981' : '#6b7280',
                                                color: 'white'
                                            }}
                                        />
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`flex-1 max-w-xs ${message.fromMe ? 'text-right' : 'text-left'}`}>
                                        {/* Sender Info */}
                                        <div className={`flex items-center gap-2 mb-2 ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                                            <span className={`text-sm font-semibold ${message.fromMe ? 'text-green-700' : 'text-gray-700'}`}>
                                                {message.fromMe ? 'AI Bot' : message.senderName}
                                            </span>
                                            {!selectedContact && (
                                                <Badge value={message.phoneNumber} className="text-xs bg-gray-100 text-gray-600" />
                                            )}
                                            <span className="text-xs text-gray-500">
                                                {formatMessageTime(message.timestamp)}
                                            </span>
                                        </div>

                                        {/* Message Content */}
                                        <div
                                            className={`p-4 rounded-xl border ${message.fromMe
                                                ? 'bg-green-50 text-gray-900 border-green-200'
                                                : 'bg-white text-gray-900 border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <i className={`${getMessageTypeIcon(message.messageType)} ${message.fromMe ? 'text-green-600' : 'text-gray-500'
                                                    } flex-shrink-0 mt-1 text-lg`}></i>

                                                <div className="flex-1">
                                                    <p className="text-sm leading-relaxed break-words">
                                                        {message.content}
                                                    </p>

                                                    {/* Message Footer */}
                                                    <div className={`flex items-center justify-between mt-3 ${message.fromMe ? 'text-green-600' : 'text-gray-500'
                                                        }`}>
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${message.fromMe
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {message.messageType}
                                                        </span>
                                                        {message.fromMe && (
                                                            <i className={`${getStatusIcon(message.status, message.fromMe)} text-sm`}></i>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Scroll to bottom indicator */}
                        <div className="text-center py-4">
                            <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                                <i className="pi pi-arrow-down"></i>
                                <span>Konuşma sonu</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};
