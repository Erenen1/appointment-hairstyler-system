"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useMemo, useState } from "react";
import { ProcessedWhatsAppMessage } from "../types";
import { format, parseISO, startOfDay, startOfWeek, startOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subDays, subWeeks, subMonths } from "date-fns";
import { tr } from "date-fns/locale";

interface WhatsAppMessageAnalyticsProps {
    messages: ProcessedWhatsAppMessage[];
}

export const WhatsAppMessageAnalytics = ({ messages }: WhatsAppMessageAnalyticsProps) => {
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
    const [messageType, setMessageType] = useState<string>("all");

    // Zaman aralığı hesaplama
    const getDateRange = () => {
        const now = new Date();
        switch (timeRange) {
            case "7d":
                return { start: subDays(now, 7), end: now };
            case "30d":
                return { start: subDays(now, 30), end: now };
            case "90d":
                return { start: subDays(now, 90), end: now };
            case "1y":
                return { start: subMonths(now, 12), end: now };
        }
    };

    const dateRange = getDateRange();

    // Filtrelenmiş mesajlar
    const filteredMessages = useMemo(() => {
        let filtered = messages.filter(msg =>
            msg.timestamp >= dateRange.start && msg.timestamp <= dateRange.end
        );

        if (messageType !== "all") {
            filtered = filtered.filter(msg => msg.messageType === messageType);
        }

        return filtered;
    }, [messages, timeRange, messageType, dateRange]);

    // Mesaj türü dağılımı
    const messageTypeDistribution = useMemo(() => {
        const typeCounts = filteredMessages.reduce((acc, msg) => {
            acc[msg.messageType] = (acc[msg.messageType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];
        const labels = Object.keys(typeCounts).map(type => {
            switch (type) {
                case "text": return "Metin";
                case "image": return "Resim";
                case "document": return "Dosya";
                case "unknown": return "Bilinmeyen";
                default: return type;
            }
        });

        return {
            labels,
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: colors.slice(0, Object.keys(typeCounts).length),
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        };
    }, [filteredMessages]);

    // Mesaj durumu dağılımı
    const messageStatusDistribution = useMemo(() => {
        const statusCounts = filteredMessages.reduce((acc, msg) => {
            acc[msg.status] = (acc[msg.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];
        const labels = Object.keys(statusCounts).map(status => {
            switch (status) {
                case "sent": return "Gönderildi";
                case "delivered": return "Teslim Edildi";
                case "read": return "Okundu";
                case "server_ack": return "Sunucu Onayı";
                default: return status;
            }
        });

        return {
            labels,
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: colors.slice(0, Object.keys(statusCounts).length),
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        };
    }, [filteredMessages]);

    // Günlük mesaj aktivitesi
    const dailyMessageActivity = useMemo(() => {
        const days = eachDayOfInterval(dateRange);
        const dailyData = days.map(day => {
            const dayStart = startOfDay(day);
            const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
            const dayMessages = filteredMessages.filter(msg =>
                msg.timestamp >= dayStart && msg.timestamp < dayEnd
            );

            return {
                date: format(day, "dd MMM", { locale: tr }),
                total: dayMessages.length,
                incoming: dayMessages.filter(msg => !msg.fromMe).length,
                outgoing: dayMessages.filter(msg => msg.fromMe).length,
                text: dayMessages.filter(msg => msg.messageType === "text").length,
                image: dayMessages.filter(msg => msg.messageType === "image").length,
                document: dayMessages.filter(msg => msg.messageType === "document").length
            };
        });

        return {
            labels: dailyData.map(d => d.date),
            datasets: [
                {
                    label: "Toplam Mesaj",
                    data: dailyData.map(d => d.total),
                    borderColor: "#10B981",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Gelen Mesaj",
                    data: dailyData.map(d => d.incoming),
                    borderColor: "#3B82F6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Giden Mesaj",
                    data: dailyData.map(d => d.outgoing),
                    borderColor: "#F59E0B",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    fill: true,
                    tension: 0.4,
                }
            ]
        };
    }, [filteredMessages, dateRange]);

    // Haftalık mesaj aktivitesi
    const weeklyMessageActivity = useMemo(() => {
        const weeks = eachWeekOfInterval(dateRange);
        const weeklyData = weeks.map(week => {
            const weekStart = startOfWeek(week, { locale: tr });
            const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            const weekMessages = filteredMessages.filter(msg =>
                msg.timestamp >= weekStart && msg.timestamp < weekEnd
            );

            return {
                week: `Hafta ${format(week, "w", { locale: tr })}`,
                total: weekMessages.length,
                incoming: weekMessages.filter(msg => !msg.fromMe).length,
                outgoing: weekMessages.filter(msg => msg.fromMe).length,
                avgPerDay: Math.round(weekMessages.length / 7 * 10) / 10
            };
        });

        return {
            labels: weeklyData.map(w => w.week),
            datasets: [
                {
                    label: "Toplam Mesaj",
                    data: weeklyData.map(w => w.total),
                    borderColor: "#8B5CF6",
                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Günlük Ortalama",
                    data: weeklyData.map(w => w.avgPerDay),
                    borderColor: "#EF4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    fill: true,
                    tension: 0.4,
                }
            ]
        };
    }, [filteredMessages, dateRange]);

    // Aylık mesaj aktivitesi
    const monthlyMessageActivity = useMemo(() => {
        const months = eachMonthOfInterval(dateRange);
        const monthlyData = months.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = new Date(monthStart.getTime() + 31 * 24 * 60 * 60 * 1000);
            const monthMessages = filteredMessages.filter(msg =>
                msg.timestamp >= monthStart && msg.timestamp < monthEnd
            );

            return {
                month: format(month, "MMM yyyy", { locale: tr }),
                total: monthMessages.length,
                incoming: monthMessages.filter(msg => !msg.fromMe).length,
                outgoing: monthMessages.filter(msg => msg.fromMe).length,
                avgPerDay: Math.round(monthMessages.length / 30 * 10) / 10
            };
        });

        return {
            labels: monthlyData.map(m => m.month),
            datasets: [
                {
                    label: "Toplam Mesaj",
                    data: monthlyData.map(m => m.total),
                    borderColor: "#10B981",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Günlük Ortalama",
                    data: monthlyData.map(m => m.avgPerDay),
                    borderColor: "#3B82F6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                    tension: 0.4,
                }
            ]
        };
    }, [filteredMessages, dateRange]);

    // Saatlik mesaj dağılımı
    const hourlyMessageDistribution = useMemo(() => {
        const hourlyData = new Array(24).fill(0).map((_, hour) => {
            const hourMessages = filteredMessages.filter(msg => msg.timestamp.getHours() === hour);
            return {
                hour: `${hour}:00`,
                total: hourMessages.length,
                incoming: hourMessages.filter(msg => !msg.fromMe).length,
                outgoing: hourMessages.filter(msg => msg.fromMe).length
            };
        });

        return {
            labels: hourlyData.map(h => h.hour),
            datasets: [
                {
                    label: "Toplam Mesaj",
                    data: hourlyData.map(h => h.total),
                    borderColor: "#10B981",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Gelen Mesaj",
                    data: hourlyData.map(h => h.incoming),
                    borderColor: "#3B82F6",
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    fill: true,
                    tension: 0.4,
                }
            ]
        };
    }, [filteredMessages]);

    // Mesaj içerik analizi
    const messageContentAnalysis = useMemo(() => {
        const textMessages = filteredMessages.filter(msg => msg.messageType === "text");
        const avgLength = textMessages.length > 0
            ? Math.round(textMessages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0) / textMessages.length)
            : 0;

        const longMessages = textMessages.filter(msg => (msg.content?.length || 0) > 100).length;
        const shortMessages = textMessages.filter(msg => (msg.content?.length || 0) <= 20).length;
        const mediumMessages = textMessages.filter(msg =>
            (msg.content?.length || 0) > 20 && (msg.content?.length || 0) <= 100
        ).length;

        return {
            avgLength,
            longMessages,
            shortMessages,
            mediumMessages,
            totalTextMessages: textMessages.length
        };
    }, [filteredMessages]);

    // Mesaj performans metrikleri
    const performanceMetrics = useMemo(() => {
        const totalMessages = filteredMessages.length;
        const incomingMessages = filteredMessages.filter(msg => !msg.fromMe).length;
        const outgoingMessages = filteredMessages.filter(msg => msg.fromMe).length;
        const responseRate = incomingMessages > 0 ? (outgoingMessages / incomingMessages) * 100 : 0;
        const readRate = totalMessages > 0 ? (filteredMessages.filter(msg => msg.status === "read").length / totalMessages) * 100 : 0;

        return {
            totalMessages,
            incomingMessages,
            outgoingMessages,
            responseRate: Math.round(responseRate),
            readRate: Math.round(readRate),
            avgMessagesPerDay: Math.round(totalMessages / Math.max(1, differenceInDays(dateRange.end, dateRange.start)) * 10) / 10
        };
    }, [filteredMessages, dateRange]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
            },
            x: {
                grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                },
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
        },
    };

    return (
        <div className="space-y-6">
            {/* Filtreler */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Zaman Aralığı</h3>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="7d">Son 7 Gün</option>
                            <option value="30d">Son 30 Gün</option>
                            <option value="90d">Son 90 Gün</option>
                            <option value="1y">Son 1 Yıl</option>
                        </select>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Mesaj Türü</h3>
                        <select
                            value={messageType}
                            onChange={(e) => setMessageType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tüm Türler</option>
                            <option value="text">Metin</option>
                            <option value="image">Resim</option>
                            <option value="document">Dosya</option>
                        </select>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    Toplam: <span className="font-semibold">{filteredMessages.length}</span> mesaj
                </div>
            </div>

            {/* Performans Metrikleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{performanceMetrics.totalMessages}</div>
                    <div className="text-sm text-gray-600">Toplam Mesaj</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-green-600">{performanceMetrics.responseRate}%</div>
                    <div className="text-sm text-gray-600">Yanıt Oranı</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{performanceMetrics.readRate}%</div>
                    <div className="text-sm text-gray-600">Okunma Oranı</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{performanceMetrics.avgMessagesPerDay}</div>
                    <div className="text-sm text-gray-600">Günlük Ortalama</div>
                </Card>
            </div>

            {/* Ana Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Mesaj Türü Dağılımı" className="h-80">
                    <Chart type="doughnut" data={messageTypeDistribution} options={pieChartOptions} />
                </Card>

                <Card title="Mesaj Durumu Dağılımı" className="h-80">
                    <Chart type="doughnut" data={messageStatusDistribution} options={pieChartOptions} />
                </Card>
            </div>

            {/* Zaman Bazlı Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Günlük Mesaj Aktivitesi" className="h-80">
                    <Chart type="line" data={dailyMessageActivity} options={chartOptions} />
                </Card>

                <Card title="Haftalık Mesaj Aktivitesi" className="h-80">
                    <Chart type="line" data={weeklyMessageActivity} options={chartOptions} />
                </Card>
            </div>

            {/* Aylık ve Saatlik Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Aylık Mesaj Aktivitesi" className="h-80">
                    <Chart type="line" data={monthlyMessageActivity} options={chartOptions} />
                </Card>

                <Card title="Saatlik Mesaj Dağılımı" className="h-80">
                    <Chart type="line" data={hourlyMessageDistribution} options={chartOptions} />
                </Card>
            </div>

            {/* Mesaj İçerik Analizi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Mesaj İçerik Analizi" className="h-80">
                    <div className="h-full flex flex-col justify-center space-y-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {messageContentAnalysis.avgLength}
                            </div>
                            <div className="text-gray-600">Ortalama Karakter Sayısı</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-lg font-bold text-green-600">
                                    {messageContentAnalysis.shortMessages}
                                </div>
                                <div className="text-xs text-green-600">Kısa (≤20)</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-lg font-bold text-blue-600">
                                    {messageContentAnalysis.mediumMessages}
                                </div>
                                <div className="text-xs text-blue-600">Orta (21-100)</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="text-lg font-bold text-purple-600">
                                    {messageContentAnalysis.longMessages}
                                </div>
                                <div className="text-xs text-purple-600">Uzun (>100)</div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Detaylı İstatistikler" className="h-80">
                    <div className="space-y-4 h-full overflow-y-auto">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Gelen Mesaj</span>
                            <span className="text-lg font-bold text-green-600">
                                {performanceMetrics.incomingMessages}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Giden Mesaj</span>
                            <span className="text-lg font-bold text-blue-600">
                                {performanceMetrics.outgoingMessages}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Metin Mesaj</span>
                            <span className="text-lg font-bold text-purple-600">
                                {messageContentAnalysis.totalTextMessages}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Resim Mesaj</span>
                            <span className="text-lg font-bold text-orange-600">
                                {filteredMessages.filter(msg => msg.messageType === "image").length}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Dosya Mesaj</span>
                            <span className="text-lg font-bold text-indigo-600">
                                {filteredMessages.filter(msg => msg.messageType === "document").length}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Okunmamış</span>
                            <span className="text-lg font-bold text-red-600">
                                {filteredMessages.filter(msg => msg.status !== "read").length}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
