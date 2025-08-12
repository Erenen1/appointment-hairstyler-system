"use client";

import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { VirtualScroller } from "primereact/virtualscroller";
import { WhatsAppContact } from "../types";

interface ContactListProps {
    contacts: WhatsAppContact[];
    selectedContact: string | null;
    onContactSelect: (phoneNumber: string) => void;
    onMarkAsRead: (phoneNumber: string) => void;
    globalFilter: string;
    onGlobalFilterChange: (value: string) => void;
    contactFilter: string;
    onContactFilterChange: (value: string) => void;
    loading?: boolean;
}

const contactFilterOptions = [
    { label: "Tüm Konuşmalar", value: "all" },
    { label: "Okunmamış", value: "unread" },
    { label: "Bugünkü Mesajlar", value: "today" }
];

export const ContactList = ({
    contacts,
    selectedContact,
    onContactSelect,
    onMarkAsRead,
    globalFilter,
    onGlobalFilterChange,
    contactFilter,
    onContactFilterChange,
    loading = false
}: ContactListProps) => {

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString("tr-TR", { weekday: "short" });
        } else {
            return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
        }
    };

    const truncateMessage = (message: string, length: number = 50) => {
        return message.length > length ? message.substring(0, length) + "..." : message;
    };

    const renderContactItem = (contact: WhatsAppContact) => (
        <div
            key={contact.phoneNumber}
            className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedContact === contact.phoneNumber
                ? "bg-green-50 border-green-200 shadow-sm"
                : "border-gray-100 hover:border-green-200 hover:bg-gray-50"
                }`}
            onClick={() => onContactSelect(contact.phoneNumber)}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <Avatar
                    image={contact.profileImage}
                    icon={!contact.profileImage ? "pi pi-user" : undefined}
                    size="large"
                    shape="circle"
                    className="border border-gray-200"
                    style={{
                        backgroundColor: !contact.profileImage ? '#10b981' : undefined,
                        color: !contact.profileImage ? 'white' : undefined
                    }}
                />
                {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
                {contact.unreadCount > 0 && (
                    <Badge
                        value={contact.unreadCount}
                        severity="danger"
                        className="absolute -top-2 -right-2"
                    />
                )}
            </div>

            {/* Contact Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{contact.name}</h4>
                    {contact.lastMessage && (
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatTime(contact.lastMessage.timestamp)}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                    {contact.phoneNumber}
                </p>
                {contact.lastMessage && (
                    <p className={`text-sm truncate mt-1 ${contact.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"
                        }`}>
                        {contact.lastMessage.fromMe && (
                            <i className="pi pi-check text-blue-500 mr-1"></i>
                        )}
                        {truncateMessage(contact.lastMessage.content)}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1 flex-shrink-0">
                {contact.unreadCount > 0 && (
                    <Button
                        icon="pi pi-check"
                        text
                        rounded
                        size="small"
                        className="text-green-600 hover:bg-green-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(contact.phoneNumber);
                        }}
                        tooltip="Okundu İşaretle"
                        tooltipOptions={{ position: 'top' }}
                    />
                )}
                <Button
                    icon="pi pi-external-link"
                    text
                    rounded
                    size="small"
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        // WhatsApp Web link
                        const cleanNumber = contact.phoneNumber.replace(/[^\d]/g, '');
                        window.open(`https://wa.me/${cleanNumber}`, '_blank');
                    }}
                    tooltip="WhatsApp'ta Aç"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="flex-1 p-4">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Filters Section */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="space-y-3">
                    <div className="relative">
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-search text-gray-400" />
                            <InputText
                                value={globalFilter}
                                onChange={(e) => onGlobalFilterChange(e.target.value)}
                                placeholder="İletişim ara..."
                                className="w-full rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
                            />
                        </span>
                    </div>

                    <Dropdown
                        value={contactFilter}
                        onChange={(e) => onContactFilterChange(e.value)}
                        options={contactFilterOptions}
                        placeholder="Filtrele"
                        className="w-full rounded-lg border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                </div>
            </div>

            {/* Contact List with VirtualScroll */}
            <div className="flex-1 overflow-hidden">
                {contacts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 px-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-users text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-gray-500 font-medium">Henüz iletişim bulunmuyor</p>
                        <p className="text-sm text-gray-400">Yeni mesajlar geldiğinde burada görünecek</p>
                    </div>
                ) : (
                    <VirtualScroller
                        items={contacts}
                        itemSize={100}
                        className="h-full"
                        itemTemplate={renderContactItem}
                        scrollHeight="100%"
                        showLoader={false}
                        delay={250}
                        style={{ width: '100%', height: '100%' }}
                    />
                )}
            </div>
        </div>
    );
};
