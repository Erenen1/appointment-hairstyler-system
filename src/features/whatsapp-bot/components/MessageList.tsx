"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { ProcessedWhatsAppMessage } from "../types";

interface MessageListProps {
    messages: ProcessedWhatsAppMessage[];
    selectedContact: string | null;
    onDeleteMessage: (messageId: string) => Promise<boolean>;
    loading?: boolean;
}

export const MessageList = ({
    messages,
    selectedContact,
    onDeleteMessage,
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
            case 'sent': return 'pi pi-check text-gray-400';
            case 'delivered': return 'pi pi-check-circle text-gray-400';
            case 'read': return 'pi pi-check-circle text-blue-500';
            default: return 'pi pi-clock text-gray-400';
        }
    };

    const confirmDelete = (messageId: string, content: string) => {
        confirmDialog({
            message: `"${content.substring(0, 50)}..." mesajını silmek istediğinizden emin misiniz?`,
            header: 'Mesajı Sil',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sil',
            rejectLabel: 'İptal',
            accept: () => onDeleteMessage(messageId)
        });
    };

    if (loading) {
        return (
            <Card title="Mesajlar" className="h-full">
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
            </Card>
        );
    }

    const title = selectedContact
        ? `Mesajlar - ${messages.find(m => m.phoneNumber === selectedContact)?.senderName || selectedContact}`
        : "Tüm Mesajlar";

    return (
        <>
            <Card title={title} className="h-full">
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <i className="pi pi-comments text-4xl mb-3"></i>
                        <p>{selectedContact ? "Bu kişi ile henüz mesaj geçmişi yok" : "Henüz mesaj bulunmuyor"}</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.fromMe ? 'flex-row-reverse' : 'flex-row'} group`}
                            >
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <Avatar
                                        icon="pi pi-user"
                                        size="normal"
                                        shape="circle"
                                        className="border-2 border-gray-200"
                                        style={{
                                            backgroundColor: message.fromMe ? '#3b82f6' : '#10b981',
                                            color: 'white'
                                        }}
                                    />
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex-1 max-w-xs ${message.fromMe ? 'text-right' : 'text-left'}`}>
                                    {/* Sender Info */}
                                    <div className={`flex items-center gap-2 mb-1 ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {message.fromMe ? 'Siz' : message.senderName}
                                        </span>
                                        {!selectedContact && (
                                            <Badge value={message.phoneNumber} className="text-xs" />
                                        )}
                                        <span className="text-xs text-gray-500">
                                            {formatMessageTime(message.timestamp)}
                                        </span>
                                    </div>

                                    {/* Message Content */}
                                    <div
                                        className={`p-3 rounded-lg shadow-sm ${message.fromMe
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-900 border border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <i className={`${getMessageTypeIcon(message.messageType)} ${message.fromMe ? 'text-blue-200' : 'text-gray-500'
                                                } flex-shrink-0 mt-0.5`}></i>

                                            <div className="flex-1">
                                                <p className="text-sm leading-relaxed break-words">
                                                    {message.content}
                                                </p>

                                                {/* Message Footer */}
                                                <div className={`flex items-center justify-between mt-2 ${message.fromMe ? 'text-blue-200' : 'text-gray-500'
                                                    }`}>
                                                    <span className="text-xs">{message.messageType}</span>
                                                    {message.fromMe && (
                                                        <i className={`${getStatusIcon(message.status, message.fromMe)} text-xs`}></i>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions (visible on hover) */}
                                    <div className={`flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${message.fromMe ? 'justify-end' : 'justify-start'
                                        }`}>
                                        <Button
                                            icon="pi pi-trash"
                                            text
                                            rounded
                                            size="small"
                                            className="text-red-500 hover:bg-red-50"
                                            onClick={() => confirmDelete(message.id, message.content)}
                                            tooltip="Mesajı Sil"
                                            tooltipOptions={{ position: 'top' }}
                                        />
                                        <Button
                                            icon="pi pi-copy"
                                            text
                                            rounded
                                            size="small"
                                            className="text-gray-500 hover:bg-gray-50"
                                            onClick={() => navigator.clipboard.writeText(message.content)}
                                            tooltip="Kopyala"
                                            tooltipOptions={{ position: 'top' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <ConfirmDialog />
        </>
    );
};
