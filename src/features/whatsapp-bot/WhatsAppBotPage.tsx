"use client";

import { useState } from "react";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useWhatsApp } from "./hooks/useWhatsApp";
import { WhatsAppStatsComponent, ContactList, MessageList } from "./components";

export default function WhatsAppBotPage() {
    const {
        messages,
        contacts,
        stats,
        botConfig,
        selectedContact,
        selectedContactMessages,
        loading,
        globalFilter,
        setGlobalFilter,
        contactFilter,
        setContactFilter,
        loadContactMessages,
        deleteMessage,
        markContactAsRead,
        refreshData
    } = useWhatsApp();

    const [viewMode, setViewMode] = useState<"overview" | "chat">("overview");

    const handleContactSelect = (phoneNumber: string) => {
        loadContactMessages(phoneNumber);
        setViewMode("chat");
    };

    const displayMessages = selectedContact ? selectedContactMessages : messages;

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Stats Section */}
            <WhatsAppStatsComponent
                stats={stats}
                botConfig={botConfig}
                loading={loading}
                onRefresh={refreshData}
            />

            {/* Main Content */}
            <div className="h-[600px]">
                <Splitter style={{ height: "100%" }}>
                    {/* Left Panel - Contacts */}
                    <SplitterPanel size={30} minSize={25}>
                        <ContactList
                            contacts={contacts}
                            selectedContact={selectedContact}
                            onContactSelect={handleContactSelect}
                            onMarkAsRead={markContactAsRead}
                            globalFilter={globalFilter}
                            onGlobalFilterChange={setGlobalFilter}
                            contactFilter={contactFilter}
                            onContactFilterChange={setContactFilter}
                            loading={loading}
                        />
                    </SplitterPanel>

                    {/* Right Panel - Messages */}
                    <SplitterPanel size={70} minSize={50}>
                        <MessageList
                            messages={displayMessages}
                            selectedContact={selectedContact}
                            onDeleteMessage={deleteMessage}
                            loading={loading}
                        />
                    </SplitterPanel>
                </Splitter>
            </div>
        </div>
    );
}
