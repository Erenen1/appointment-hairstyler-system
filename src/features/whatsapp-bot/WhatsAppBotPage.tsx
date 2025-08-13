"use client";

import { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { ProgressBar } from "primereact/progressbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { useWhatsApp } from "./hooks/useWhatsApp";
import { ContactList, MessageList, WhatsAppAnalytics } from "./components";
import { PageHeader } from "../../components/ui";

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
        markContactAsRead,
        refreshData
    } = useWhatsApp();

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [timeRange, setTimeRange] = useState('daily');
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const handleTabChange = (e: { index: number }) => {
        setActiveTabIndex(e.index);
    };

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 md:p-8 border border-green-200">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 md:mb-6 shadow-lg">
                        <i className="pi pi-whatsapp text-white text-2xl md:text-3xl"></i>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
                        {botConfig?.instanceName || 'WhatsApp Bot'} Yönetim Paneli
                    </h1>
                    <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto">
                        Webhook entegrasyonu ile güçlendirilmiş, modern WhatsApp bot yönetimi
                    </p>
                </div>
            </div>

            {/* Status Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Card className="bg-white rounded-xl border-0 shadow-sm">
                    <div className="p-4 md:p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-check-circle text-blue-600 text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Webhook Durumu</h3>
                        <Badge value="Aktif" severity="success" className="text-sm" />
                        <p className="text-sm text-gray-600 mt-2">Gerçek zamanlı veri akışı</p>
                    </div>
                </Card>

                <Card className="bg-white rounded-xl border-0 shadow-sm">
                    <div className="p-4 md:p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-server text-blue-600 text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Instance</h3>
                        <Badge value="Bağlı" severity="info" className="text-sm" />
                        <p className="text-sm text-gray-600 mt-2">Stabil bağlantı</p>
                    </div>
                </Card>

                <Card className="bg-white rounded-xl border-0 shadow-sm sm:col-span-2 lg:col-span-1">
                    <div className="p-4 md:p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="pi pi-database text-purple-600 text-xl"></i>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Veritabanı</h3>
                        <Badge value="Senkron" severity="success" className="text-sm" />
                        <p className="text-sm text-gray-600 mt-2">Güncel veriler</p>
                    </div>
                </Card>
            </div>

            {/* Bot Configuration Card */}
            <Card className="bg-white rounded-xl border-0 shadow-sm">
                <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <i className="pi pi-whatsapp text-white text-2xl"></i>
                            </div>
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">Bot Konfigürasyonu</h3>
                                    <Badge
                                        value={botConfig?.isActive ? "Aktif" : "Pasif"}
                                        severity={botConfig?.isActive ? "success" : "danger"}
                                        className="text-sm px-3 py-1 w-fit"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Telefon:</span> {botConfig?.phoneNumber || 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Instance ID:</span> {botConfig?.instanceId ? `${botConfig.instanceId.substring(0, 8)}...` : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Son Aktivite:</span> {botConfig?.lastActivity ?
                                            `${botConfig.lastActivity.toLocaleDateString("tr-TR")} ${botConfig.lastActivity.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <Button
                                icon="pi pi-refresh"
                                label="Yenile"
                                className="!bg-green-600 hover:!bg-green-700 !border-green-600 px-4 md:px-6 py-3 rounded-xl shadow-sm"
                                onClick={refreshData}
                            />
                            <Button
                                icon="pi pi-cog"
                                label="Ayarlar"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-100 px-4 md:px-6 py-3 rounded-xl shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Quick Stats Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    {
                        title: "Toplam Mesaj",
                        value: stats?.totalMessages || 0,
                        icon: "pi pi-comments",
                        color: "from-green-500 to-emerald-500",
                        bgColor: "from-green-50 to-emerald-50",
                        borderColor: "border-green-200"
                    },
                    {
                        title: "Aktif Sohbet",
                        value: stats?.activeChats || 0,
                        icon: "pi pi-users",
                        color: "from-blue-500 to-indigo-500",
                        bgColor: "from-blue-50 to-indigo-50",
                        borderColor: "border-blue-200"
                    },
                    {
                        title: "Bugünkü Mesaj",
                        value: stats?.todayMessages || 0,
                        icon: "pi pi-calendar",
                        color: "from-purple-500 to-pink-500",
                        bgColor: "from-purple-50 to-pink-50",
                        borderColor: "border-purple-200"
                    },
                    {
                        title: "Yanıt Oranı",
                        value: `${stats?.responseRate || 0}%`,
                        icon: "pi pi-chart-line",
                        color: "from-orange-500 to-red-500",
                        bgColor: "from-orange-50 to-red-50",
                        borderColor: "border-orange-200"
                    }
                ].map((stat, index) => (
                    <Card key={index} className={`h-32 md:h-40 hover:bg-opacity-80 transition-all duration-200 border-0 ${stat.borderColor} bg-gradient-to-br ${stat.bgColor}`}>
                        <div className="flex items-center justify-between h-full p-4">
                            <div>
                                <p className="text-xs md:text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                                <p className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                <i className={`${stat.icon} text-white text-lg md:text-xl`}></i>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Performance Metrics - Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white rounded-2xl shadow-sm border-0">
                    <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Performans Metrikleri</h3>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-600">Ortalama Yanıt Süresi</span>
                                    <span className="font-semibold text-gray-900">{stats?.avgResponseTime || 'N/A'}</span>
                                </div>
                                <ProgressBar value={75} className="h-3 rounded-full" />
                                <p className="text-xs text-gray-500 mt-1">Hedef: 2 dakika</p>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-600">Toplam İletişim</span>
                                    <span className="font-semibold text-gray-900">{stats?.totalContacts || 0}</span>
                                </div>
                                <ProgressBar value={60} className="h-3 rounded-full" />
                                <p className="text-xs text-gray-500 mt-1">Bu ay: 23 kişi</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="bg-white rounded-2xl shadow-sm border-0">
                    <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Webhook Bilgileri</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Webhook URL</p>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="text-xs text-gray-700 font-mono break-all">
                                        {botConfig?.webhookUrl || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Business Name</span>
                                <Badge value={botConfig?.instanceName || 'N/A'} className="bg-green-100 text-green-800" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Webhook Durumu</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-green-600 font-medium">Aktif</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderAnalyticsTab = () => (
        <div className="space-y-6">
            <WhatsAppAnalytics
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />

            {/* Enhanced Analytics Table */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
                <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Detaylı Performans Analizi</h3>
                    <div className="overflow-x-auto">
                        <DataTable
                            value={[
                                { metric: 'Toplam Mesaj', daily: 450, weekly: 3200, monthly: 12800, trend: '+12%', status: 'success' },
                                { metric: 'Yanıtlanan Mesaj', daily: 380, weekly: 2800, monthly: 11200, trend: '+8%', status: 'success' },
                                { metric: 'Yeni İletişim', daily: 28, weekly: 195, monthly: 780, trend: '+15%', status: 'success' },
                                { metric: 'Ortalama Yanıt Süresi', daily: '2.3dk', weekly: '2.1dk', monthly: '1.9dk', trend: '-5%', status: 'success' },
                                { metric: 'Başarı Oranı', daily: '84%', weekly: '87%', monthly: '89%', trend: '+2%', status: 'success' }
                            ]}
                            className="border-0"
                            stripedRows
                            showGridlines={false}
                            responsiveLayout="scroll"
                        >
                            <Column field="metric" header="Metrik" className="font-semibold text-gray-900" />
                            <Column field="daily" header="Günlük" className="text-center" />
                            <Column field="weekly" header="Haftalık" className="text-center" />
                            <Column field="monthly" header="Aylık" className="text-center" />
                            <Column field="trend" header="Trend" body={(rowData) => (
                                <Badge
                                    value={rowData.trend}
                                    severity={rowData.trend.includes('+') ? 'success' : 'danger'}
                                    className="px-3 py-1 rounded-full"
                                />
                            )} />
                        </DataTable>
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderMessagesTab = () => (
        <div className="space-y-6">
            {/* Messages Header */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 md:p-8 border border-green-200/50">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 md:mb-6 shadow-lg">
                        <i className="pi pi-comments text-white text-2xl md:text-3xl"></i>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">AI Bot Konuşma Geçmişi</h3>
                    <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto">
                        Webhook üzerinden gelen tüm AI konuşmalarını görüntüleyin, müşterilerinizle olan konuşmaları takip edin ve analiz edin
                    </p>
                </div>

                {/* Quick Stats - Responsive Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-green-200/50">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="pi pi-comments text-green-600 text-lg md:text-xl"></i>
                        </div>
                        <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">Toplam Mesaj</h4>
                        <p className="text-lg md:text-2xl font-bold text-green-600">{messages.length}</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-green-200/50">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="pi pi-users text-blue-600 text-lg md:text-xl"></i>
                        </div>
                        <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">Aktif Müşteri</h4>
                        <p className="text-lg md:text-2xl font-bold text-blue-600">{contacts.length}</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-green-200/50">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="pi pi-bolt text-purple-600 text-lg md:text-xl"></i>
                        </div>
                        <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">AI Yanıtları</h4>
                        <p className="text-lg md:text-2xl font-bold text-purple-600">{messages.filter(m => m.fromMe).length}</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-green-200/50">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="pi pi-clock text-orange-600 text-lg md:text-xl"></i>
                        </div>
                        <h4 className="text-sm md:text-lg font-semibold text-gray-900 mb-1">Ortalama Süre</h4>
                        <p className="text-lg md:text-2xl font-bold text-orange-600">2.3dk</p>
                    </div>
                </div>
            </div>

            {/* Enhanced Split View - Mobile Responsive */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex flex-col lg:flex-row h-[600px] md:h-[700px]">
                    {/* Contacts Panel */}
                    <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/50">
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <i className="pi pi-users text-green-600 text-lg md:text-xl"></i>
                                </div>
                                <h4 className="text-base md:text-lg font-bold text-gray-900">Müşteri Listesi</h4>
                                <Badge value={contacts.length} className="bg-green-100 text-green-800" />
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 mb-4">
                                Müşterilerinizi seçin ve konuşma geçmişini görüntüleyin
                            </p>
                        </div>

                        <div className="h-full overflow-y-auto">
                            <ContactList
                                contacts={contacts}
                                selectedContact={selectedContact}
                                onContactSelect={loadContactMessages}
                                onMarkAsRead={markContactAsRead}
                                globalFilter={globalFilter}
                                onGlobalFilterChange={setGlobalFilter}
                                contactFilter={contactFilter}
                                onContactFilterChange={setContactFilter}
                                loading={loading}
                            />
                        </div>
                    </div>

                    {/* Messages Panel */}
                    <div className="lg:w-2/3 bg-white">
                        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <i className="pi pi-bolt text-green-600 text-lg md:text-xl"></i>
                                </div>
                                <h4 className="text-base md:text-lg font-bold text-gray-900">AI Assistant Konuşması</h4>
                                {selectedContact && (
                                    <Badge
                                        value={selectedContactMessages.length}
                                        className="bg-green-100 text-green-800"
                                    />
                                )}
                            </div>
                            <p className="text-xs md:text-sm text-gray-600">
                                {selectedContact
                                    ? `${contacts.find(c => c.phoneNumber === selectedContact)?.name || selectedContact} ile olan konuşma`
                                    : "Bir müşteri seçin ve konuşma geçmişini görüntüleyin"
                                }
                            </p>
                        </div>

                        <div className="h-full overflow-y-auto">
                            <MessageList
                                messages={selectedContact ? selectedContactMessages : messages}
                                selectedContact={selectedContact}
                                loading={loading}
                                onSendMessage={() => {
                                    if (selectedContact) {
                                        const cleanNumber = selectedContact.replace(/[^\d]/g, '');
                                        window.open(`https://wa.me/${cleanNumber}`, '_blank');
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6">
            {/* Page Header */}
            <div className="px-4 md:px-6">
                <PageHeader
                    title="WhatsApp Bot Yönetimi"
                    description={`${botConfig?.instanceName || 'Business'} için gelişmiş WhatsApp bot yönetim paneli. Webhook entegrasyonu ile gerçek zamanlı veri akışı ve kapsamlı analitik.`}
                    icon="pi pi-whatsapp"
                    iconBgColor="from-green-500 to-emerald-600"
                    gradientFrom="from-green-50"
                    gradientTo="to-emerald-100"
                    borderColor="border-green-200"
                />
            </div>

            {/* Main Content */}
            <div className="px-4 md:px-6">
                <Card className="bg-white rounded-xl border-0 overflow-hidden shadow-sm">
                    <TabView
                        activeIndex={activeTabIndex}
                        onTabChange={handleTabChange}
                        className="border-0 [&_.p-tabview-nav]:border-gray-200 [&_.p-tabview-nav]:px-4 [&_.p-tabview-nav]:py-2 [&_.p-tabview-nav-link]:text-gray-600 [&_.p-tabview-nav-link]:border-transparent [&_.p-tabview-nav-link]:bg-transparent [&_.p-tabview-nav-link.p-highlight]:text-green-600 [&_.p-tabview-nav-link.p-highlight]:border-green-500 [&_.p-tabview-nav-link.p-highlight]:bg-green-50 [&_.p-tabview-nav-link]:hover:text-green-600 [&_.p-tabview-nav-link]:hover:border-green-300 [&_.p-tabview-nav-link]:hover:bg-green-50"
                    >
                        <TabPanel header="Genel Bakış" className="p-4 md:p-6 lg:p-8">
                            {renderOverviewTab()}
                        </TabPanel>
                        <TabPanel header="Analitik" className="p-4 md:p-6 lg:p-8">
                            {renderAnalyticsTab()}
                        </TabPanel>
                        <TabPanel header="Mesajlar" className="p-4 md:p-6 lg:p-8">
                            {renderMessagesTab()}
                        </TabPanel>
                    </TabView>
                </Card>
            </div>
        </div>
    );
}
