"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { useMemo, useState } from "react";
import { ProcessedWhatsAppMessage, WhatsAppContact } from "../types";
import { format, differenceInDays, differenceInHours, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";

interface WhatsAppCustomerAnalyticsProps {
    messages: ProcessedWhatsAppMessage[];
    contacts: WhatsAppContact[];
}

export const WhatsAppCustomerAnalytics = ({ messages, contacts }: WhatsAppCustomerAnalyticsProps) => {
    const [selectedCustomerSegment, setSelectedCustomerSegment] = useState<string>("all");

    // Müşteri segmentasyonu
    const customerSegments = useMemo(() => {
        const now = new Date();
        const today = startOfDay(now);

        return contacts.map(contact => {
            const contactMessages = messages.filter(msg => msg.phoneNumber === contact.phoneNumber);
            const lastMessage = contact.lastMessage;
            const daysSinceLastActivity = lastMessage ? differenceInDays(today, lastMessage.timestamp) : 999;
            const totalMessages = contactMessages.length;
            const incomingMessages = contactMessages.filter(msg => !msg.fromMe).length;
            const responseRate = incomingMessages > 0 ? (contactMessages.length - incomingMessages) / incomingMessages * 100 : 0;

            let segment = "inactive";
            let segmentColor = "danger";
            let segmentLabel = "Pasif";

            if (daysSinceLastActivity <= 1) {
                segment = "very_active";
                segmentColor = "success";
                segmentLabel = "Çok Aktif";
            } else if (daysSinceLastActivity <= 7) {
                segment = "active";
                segmentColor = "info";
                segmentLabel = "Aktif";
            } else if (daysSinceLastActivity <= 30) {
                segment = "moderate";
                segmentColor = "warning";
                segmentLabel = "Orta";
            }

            return {
                ...contact,
                segment,
                segmentColor,
                segmentLabel,
                daysSinceLastActivity,
                totalMessages,
                incomingMessages,
                responseRate: Math.round(responseRate),
                avgResponseTime: calculateAvgResponseTime(contactMessages),
                lastActivity: lastMessage?.timestamp || new Date(0)
            };
        });
    }, [contacts, messages]);

    // Ortalama yanıt süresi hesaplama
    const calculateAvgResponseTime = (contactMessages: ProcessedWhatsAppMessage[]): string => {
        const responseTimes: number[] = [];
        const sortedMessages = contactMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        for (let i = 0; i < sortedMessages.length - 1; i++) {
            const currentMsg = sortedMessages[i];
            const nextMsg = sortedMessages[i + 1];

            if (!currentMsg.fromMe && nextMsg.fromMe) {
                const responseTime = nextMsg.timestamp.getTime() - currentMsg.timestamp.getTime();
                responseTimes.push(responseTime / (1000 * 60)); // Dakika cinsinden
            }
        }

        if (responseTimes.length === 0) return "N/A";

        const avgMinutes = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

        if (avgMinutes < 60) {
            return `${Math.round(avgMinutes)} dk`;
        } else if (avgMinutes < 1440) {
            return `${Math.round(avgMinutes / 60)} saat`;
        } else {
            return `${Math.round(avgMinutes / 1440)} gün`;
        }
    };

    // Segment bazlı filtreleme
    const filteredCustomers = useMemo(() => {
        if (selectedCustomerSegment === "all") return customerSegments;
        return customerSegments.filter(customer => customer.segment === selectedCustomerSegment);
    }, [customerSegments, selectedCustomerSegment]);

    // Segment dağılımı grafiği
    const segmentDistributionData = useMemo(() => {
        const segmentCounts = customerSegments.reduce((acc, customer) => {
            acc[customer.segment] = (acc[customer.segment] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];
        const labels = ["Çok Aktif", "Aktif", "Orta", "Pasif"];

        return {
            labels,
            datasets: [{
                data: [
                    segmentCounts.very_active || 0,
                    segmentCounts.active || 0,
                    segmentCounts.moderate || 0,
                    segmentCounts.inactive || 0
                ],
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        };
    }, [customerSegments]);

    // Müşteri değer analizi
    const customerValueData = useMemo(() => {
        const valueSegments = customerSegments.map(customer => ({
            name: customer.name,
            value: customer.totalMessages * 10 + (customer.responseRate > 80 ? 50 : 0) + (customer.daysSinceLastActivity <= 7 ? 30 : 0)
        })).sort((a, b) => b.value - a.value).slice(0, 15);

        return {
            labels: valueSegments.map(c => c.name),
            datasets: [{
                label: "Müşteri Değeri",
                data: valueSegments.map(c => c.value),
                backgroundColor: "rgba(139, 92, 246, 0.8)",
                borderColor: "#8B5CF6",
                borderWidth: 2,
            }]
        };
    }, [customerSegments]);

    // Zaman bazlı aktivite analizi
    const timeBasedActivityData = useMemo(() => {
        const hourlyActivity = new Array(24).fill(0);
        const dailyActivity = new Array(7).fill(0);

        messages.forEach(msg => {
            const hour = msg.timestamp.getHours();
            const day = msg.timestamp.getDay();
            hourlyActivity[hour]++;
            dailyActivity[day]++;
        });

        return {
            hourly: {
                labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                datasets: [{
                    label: "Mesaj Sayısı",
                    data: hourlyActivity,
                    borderColor: "#10B981",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    fill: true,
                    tension: 0.4,
                }]
            },
            daily: {
                labels: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
                datasets: [{
                    label: "Mesaj Sayısı",
                    data: dailyActivity,
                    borderColor: "#3B82F6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    fill: true,
                    tension: 0.4,
                }]
            }
        };
    }, [messages]);

    // Müşteri etkileşim analizi
    const interactionAnalysis = useMemo(() => {
        const interactionLevels = customerSegments.map(customer => {
            const contactMessages = messages.filter(msg => msg.phoneNumber === customer.phoneNumber);
            const uniqueDays = new Set(contactMessages.map(msg =>
                format(msg.timestamp, "yyyy-MM-dd")
            )).size;

            let interactionLevel = "Düşük";
            let levelColor = "danger";

            if (uniqueDays >= 10) {
                interactionLevel = "Çok Yüksek";
                levelColor = "success";
            } else if (uniqueDays >= 5) {
                interactionLevel = "Yüksek";
                levelColor = "info";
            } else if (uniqueDays >= 2) {
                interactionLevel = "Orta";
                levelColor = "warning";
            }

            return {
                ...customer,
                interactionLevel,
                levelColor,
                uniqueDays
            };
        });

        return interactionLevels;
    }, [customerSegments, messages]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
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
            {/* Segment Seçimi */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Müşteri Segmenti</h3>
                    <select
                        value={selectedCustomerSegment}
                        onChange={(e) => setSelectedCustomerSegment(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Tüm Müşteriler</option>
                        <option value="very_active">Çok Aktif</option>
                        <option value="active">Aktif</option>
                        <option value="moderate">Orta</option>
                        <option value="inactive">Pasif</option>
                    </select>
                </div>
                <div className="text-sm text-gray-600">
                    Toplam: <span className="font-semibold">{filteredCustomers.length}</span> müşteri
                </div>
            </div>

            {/* Segment Dağılımı */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Müşteri Segment Dağılımı" className="h-80">
                    <Chart type="doughnut" data={segmentDistributionData} options={pieChartOptions} />
                </Card>

                <Card title="En Değerli Müşteriler (Top 15)" className="h-80">
                    <Chart type="bar" data={customerValueData} options={chartOptions} />
                </Card>
            </div>

            {/* Zaman Bazlı Analiz */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Saatlik Aktivite Dağılımı" className="h-80">
                    <Chart type="line" data={timeBasedActivityData.hourly} options={chartOptions} />
                </Card>

                <Card title="Günlük Aktivite Dağılımı" className="h-80">
                    <Chart type="line" data={timeBasedActivityData.daily} options={chartOptions} />
                </Card>
            </div>

            {/* Müşteri Listesi */}
            <Card title="Müşteri Detay Analizi">
                <DataTable
                    value={filteredCustomers}
                    paginator
                    rows={10}
                    stripedRows
                    tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple"
                    removableSort
                    globalFilterFields={["name", "phoneNumber", "segmentLabel"]}
                >
                    <Column field="name" header="Müşteri Adı" sortable />
                    <Column field="phoneNumber" header="Telefon" sortable />
                    <Column field="segmentLabel" header="Segment" sortable
                        body={(rowData) => (
                            <Tag value={rowData.segmentLabel} severity={rowData.segmentColor} />
                        )}
                    />
                    <Column field="totalMessages" header="Toplam Mesaj" sortable />
                    <Column field="incomingMessages" header="Gelen Mesaj" sortable />
                    <Column field="responseRate" header="Yanıt Oranı" sortable
                        body={(rowData) => `${rowData.responseRate}%`}
                    />
                    <Column field="avgResponseTime" header="Ort. Yanıt Süresi" sortable />
                    <Column field="daysSinceLastActivity" header="Son Aktivite" sortable
                        body={(rowData) => `${rowData.daysSinceLastActivity} gün önce`}
                    />
                    <Column field="unreadCount" header="Okunmamış" sortable />
                    <Column header="İşlemler"
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-eye"
                                    size="small"
                                    outlined
                                    tooltip="Detay Görüntüle"
                                />
                                <Button
                                    icon="pi pi-comment"
                                    size="small"
                                    outlined
                                    tooltip="Mesaj Gönder"
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </Card>

            {/* Etkileşim Analizi */}
            <Card title="Müşteri Etkileşim Analizi">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {interactionAnalysis.filter(c => c.levelColor === "success").length}
                        </div>
                        <div className="text-sm text-green-600">Çok Yüksek Etkileşim</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {interactionAnalysis.filter(c => c.levelColor === "info").length}
                        </div>
                        <div className="text-sm text-blue-600">Yüksek Etkileşim</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                            {interactionAnalysis.filter(c => c.levelColor === "warning").length}
                        </div>
                        <div className="text-sm text-orange-600">Orta Etkileşim</div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
