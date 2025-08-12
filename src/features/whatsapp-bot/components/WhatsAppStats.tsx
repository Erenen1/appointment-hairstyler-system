"use client";

import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { WhatsAppStats, WhatsAppBotConfig } from "../types";

interface WhatsAppStatsProps {
    stats: WhatsAppStats | null;
    botConfig: WhatsAppBotConfig | null;
    loading?: boolean;
    onRefresh?: () => void;
}

export const WhatsAppStatsComponent = ({ stats, botConfig, loading = false, onRefresh }: WhatsAppStatsProps) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="h-32">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats || !botConfig) {
        return null;
    }

    const statCards = [
        {
            title: "Toplam Mesaj",
            value: stats.totalMessages,
            icon: "pi pi-comments",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "Aktif Sohbet",
            value: stats.activeChats,
            icon: "pi pi-users",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "Bugünkü Mesaj",
            value: stats.todayMessages,
            icon: "pi pi-calendar",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "Yanıt Oranı",
            value: `${stats.responseRate}%`,
            icon: "pi pi-chart-line",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Bot Status Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <i className="pi pi-whatsapp text-white text-xl"></i>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-gray-900">WhatsApp Bot</h3>
                                <Badge
                                    value={botConfig.isActive ? "Aktif" : "Pasif"}
                                    severity={botConfig.isActive ? "success" : "danger"}
                                />
                            </div>
                            <p className="text-sm text-gray-600">{botConfig.phoneNumber}</p>
                            <p className="text-xs text-gray-500">
                                Son aktivite: {botConfig.lastActivity.toLocaleDateString("tr-TR")} {botConfig.lastActivity.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            icon="pi pi-refresh"
                            text
                            rounded
                            className="text-green-600 hover:bg-green-100"
                            onClick={onRefresh}
                            tooltip="Verileri Yenile"
                            tooltipOptions={{ position: 'top' }}
                        />
                        <Button
                            icon="pi pi-cog"
                            text
                            rounded
                            className="text-green-600 hover:bg-green-100"
                            tooltip="Bot Ayarları"
                            tooltipOptions={{ position: 'top' }}
                        />
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="h-32 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center justify-between h-full">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                <i className={`${stat.icon} ${stat.color} text-xl`}></i>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Performance">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Ortalama Yanıt Süresi</span>
                            <Badge value={stats.avgResponseTime} severity="info" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Toplam İletişim</span>
                            <span className="font-semibold">{stats.totalContacts}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Instance ID</span>
                            <span className="text-xs text-gray-500 font-mono">{botConfig.instanceId.substring(0, 8)}...</span>
                        </div>
                    </div>
                </Card>

                <Card title="Webhook Bilgileri">
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Webhook URL</p>
                            <p className="text-xs text-gray-500 font-mono break-all bg-gray-50 p-2 rounded">
                                {botConfig.webhookUrl}
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Instance Name</span>
                            <Badge value={botConfig.instanceName} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
