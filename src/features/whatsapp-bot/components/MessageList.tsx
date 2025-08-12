"use client";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { VirtualScroller } from "primereact/virtualscroller";
import { ProcessedWhatsAppMessage } from "../types";

interface MessageListProps {
    messages: ProcessedWhatsAppMessage[];
    selectedContact: string | null;
    loading?: boolean;
    onSendMessage?: () => void;
}

export const MessageList = ({
    messages,
    selectedContact,
    loading = false,
    onSendMessage
}: MessageListProps) => {

    const formatMessageTime = (date: Date) => {
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString("tr-TR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit"
            });
        } else {
            return date.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
    };

    const getStatusIcon = (status: string, fromMe: boolean) => {
        if (!fromMe) return null;

        switch (status) {
            case 'sent': return 'pi pi-check text-gray-400';
            case 'delivered': return 'pi pi-check text-blue-400';
            case 'read': return 'pi pi-check text-blue-600';
            case 'failed': return 'pi pi-exclamation-triangle text-red-500';
            case 'pending': return 'pi pi-clock text-gray-400';
            default: return 'pi pi-clock text-gray-400';
        }
    };



    const renderSohbetSonudur = () => (
        <div className="px-4 py-4">
            <div className="text-center">
                <div className="inline-flex items-center gap-3 text-sm text-gray-600 bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                    <i className="pi pi-arrow-down text-emerald-500"></i>
                    <span className="font-semibold text-gray-700">Sohbet Sonudur</span>
                    <i className="pi pi-arrow-down text-emerald-500"></i>
                </div>
                <p className="text-xs text-gray-400 mt-2">Bu konuşma grubu tamamlandı</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="h-full p-6">
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header with Send Message Button */}
            {selectedContact && (
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar
                                icon="pi pi-user"
                                size="normal"
                                shape="circle"
                                className="border border-gray-200 bg-green-100"
                                style={{ color: '#10b981' }}
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900">{selectedContact}</h3>
                                <p className="text-sm text-gray-500">Müşteri ile iletişim</p>
                            </div>
                        </div>
                        <Button
                            icon="pi pi-send"
                            label="Mesaj Gönder"
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                            onClick={onSendMessage}
                        />
                    </div>
                </div>
            )}

            {/* Messages Content */}
            <div className="flex-1 overflow-hidden">
                {!selectedContact ? (
                    <div className="h-full flex flex-col items-center justify-center px-6 py-12">
                        {/* Professional WhatsApp-like Empty State */}
                        <div className="text-center max-w-md">
                            {/* Icon Container */}
                            <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
                                <i className="pi pi-comments text-4xl text-green-600"></i>
                            </div>

                            {/* Main Message */}
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                Sohbet Seçiniz
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Sol taraftaki müşteri listesinden bir konuşma seçerek mesaj geçmişini görüntüleyebilir ve yeni mesajlar gönderebilirsiniz.
                            </p>

                            {/* Action Hint */}
                            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
                                <i className="pi pi-arrow-left text-emerald-500"></i>
                                <span>Müşteri listesinden seçim yapın</span>
                            </div>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 px-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-comments text-3xl text-gray-400"></i>
                        </div>
                        <p className="text-gray-500 font-medium mb-2">
                            Bu kişi ile henüz mesaj geçmişi yok
                        </p>
                        <p className="text-sm text-gray-400">
                            İlk mesajı göndererek konuşmayı başlatın
                        </p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col">
                        <VirtualScroller
                            items={messages}
                            itemSize={140}
                            className="flex-1"
                            scrollHeight="100%"
                            showLoader={false}
                            delay={0}
                            lazy={false}
                            itemTemplate={(message) => (
                                <div className="px-4 py-3">
                                    <div className={`flex gap-3 ${message.fromMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <Avatar
                                                icon={message.fromMe ? "pi pi-bolt" : "pi pi-user"}
                                                size="normal"
                                                shape="circle"
                                                className="border border-gray-200"
                                                style={{
                                                    backgroundColor: message.fromMe ? '#10b981' : '#6b7280',
                                                    color: 'white'
                                                }}
                                            />
                                        </div>

                                        {/* Message Content */}
                                        <div className={`flex-1 max-w-xs ${message.fromMe ? 'text-right' : 'text-left'}`}>
                                            {/* Sender Info */}
                                            <div className={`flex items-center gap-2 mb-2 ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                                                <span className={`text-xs font-medium ${message.fromMe ? 'text-green-600' : 'text-gray-600'}`}>
                                                    {message.fromMe ? '🤖 AI Asistan' : (message.senderName || 'Müşteri')}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {formatMessageTime(message.timestamp)}
                                                </span>
                                            </div>

                                            {/* Message Bubble */}
                                            <div
                                                className={`p-3 rounded-2xl ${message.fromMe
                                                    ? 'bg-emerald-100 text-gray-800 border border-emerald-200'
                                                    : 'bg-slate-50 text-gray-800 border border-slate-200'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed break-words">
                                                    {message.content}
                                                </p>

                                                {/* Message Status */}
                                                {message.fromMe && (
                                                    <div className="flex items-center justify-end gap-1 mt-2">
                                                        <i className={`${getStatusIcon(message.status, message.fromMe)} text-xs`}></i>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />

                        {/* Professional Conversation End Indicator */}
                        {renderSohbetSonudur()}
                    </div>
                )}

                {/* Final Chat End Indicator - Only show when there are messages */}
                {selectedContact && messages.length > 0 && (
                    <div className="px-6 py-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 text-sm text-gray-600 bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
                                <i className="pi pi-shield-check text-emerald-500 text-lg"></i>
                                <span className="font-semibold text-gray-700">Konuşma Güvenliği</span>
                                <i className="pi pi-lock text-emerald-500 text-lg"></i>
                            </div>
                            <div className="mt-3 space-y-2">
                                <p className="text-xs text-gray-500">Bu konuşma uçtan uca şifrelenmiş ve güvenli</p>
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <i className="pi pi-clock text-emerald-400"></i>
                                        Son güncelleme: {new Date().toLocaleDateString("tr-TR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <i className="pi pi-message text-emerald-400"></i>
                                        {messages.length} mesaj
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
