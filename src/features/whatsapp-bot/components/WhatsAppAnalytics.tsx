"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useState, useEffect } from "react";

interface WhatsAppAnalyticsProps {
    timeRange: string;
    onTimeRangeChange: (value: string) => void;
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
}

export const WhatsAppAnalytics = ({
    timeRange,
    onTimeRangeChange,
    selectedDate,
    onDateChange
}: WhatsAppAnalyticsProps) => {
    const [chartData, setChartData] = useState({
        messages: {},
        responses: {},
        contacts: {},
        responseRate: {},
        messageTypes: {},
        hourlyActivity: {},
        performanceMetrics: {}
    });

    // Enhanced mock data for charts with more realistic business data
    const analyticsData = {
        daily: {
            messages: [45, 52, 48, 67, 89, 76, 94],
            responses: [38, 45, 42, 58, 76, 65, 82],
            contacts: [8, 12, 9, 15, 18, 14, 22],
            hourly: [2, 1, 0, 0, 1, 3, 7, 12, 18, 25, 31, 28, 24, 19, 15, 12, 8, 5, 3, 2, 1, 1, 0, 0]
        },
        weekly: {
            messages: [320, 280, 450, 380, 420, 390, 350, 410],
            responses: [280, 250, 400, 350, 380, 350, 320, 370],
            contacts: [45, 52, 48, 65, 58, 72, 68, 75],
            hourly: [15, 12, 8, 5, 3, 2, 1, 0, 0, 1, 3, 7, 12, 18, 25, 31, 28, 24, 19, 15, 12, 8, 5, 3]
        },
        monthly: {
            messages: [1200, 1350, 1100, 1400, 1250, 1300, 1150, 1200, 1350, 1100, 1400, 1250],
            responses: [1000, 1150, 950, 1200, 1050, 1100, 950, 1000, 1150, 950, 1200, 1050],
            contacts: [180, 200, 175, 220, 195, 210, 185, 190, 205, 180, 215, 200],
            hourly: [25, 20, 15, 10, 8, 5, 3, 2, 1, 0, 0, 1, 3, 7, 12, 18, 25, 31, 28, 24, 19, 15, 12, 8]
        }
    };

    const timeRangeOptions = [
        { label: '📅 Günlük', value: 'daily' },
        { label: '📊 Haftalık', value: 'weekly' },
        { label: '📈 Aylık', value: 'monthly' }
    ];

    useEffect(() => {
        updateCharts();
    }, [timeRange]);

    const updateCharts = () => {
        const data = analyticsData[timeRange as keyof typeof analyticsData];
        const labels = timeRange === 'daily'
            ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
            : timeRange === 'weekly'
                ? ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta', '5. Hafta', '6. Hafta', '7. Hafta', '8. Hafta']
                : ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

        const hourlyLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);

        setChartData({
            messages: {
                labels,
                datasets: [{
                    label: 'Toplam Mesajlar',
                    data: data.messages,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            responses: {
                labels,
                datasets: [{
                    label: 'Yanıtlanan Mesajlar',
                    data: data.responses,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#059669',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            contacts: {
                labels,
                datasets: [{
                    label: 'Yeni İletişimler',
                    data: data.contacts,
                    borderColor: '#047857',
                    backgroundColor: 'rgba(4, 120, 87, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#047857',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            responseRate: {
                labels: ['0-1dk', '1-5dk', '5-15dk', '15-30dk', '30dk+'],
                datasets: [{
                    data: [25, 35, 20, 15, 5],
                    backgroundColor: [
                        '#10b981',
                        '#059669',
                        '#047857',
                        '#065f46',
                        '#064e3b'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            messageTypes: {
                labels: ['Metin', 'Resim', 'Dosya', 'Ses', 'Video'],
                datasets: [{
                    data: [65, 20, 10, 3, 2],
                    backgroundColor: [
                        '#10b981',
                        '#059669',
                        '#047857',
                        '#065f46',
                        '#064e3b'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            hourlyActivity: {
                labels: hourlyLabels,
                datasets: [{
                    label: 'Saatlik Aktivite',
                    data: data.hourly,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            performanceMetrics: {
                labels: ['Yanıt Oranı', 'Müşteri Memnuniyeti', 'Mesaj Kalitesi', 'Hız', 'Doğruluk'],
                datasets: [{
                    label: 'Performans Skoru',
                    data: [87, 92, 78, 85, 90],
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    borderWidth: 3,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            }
        });
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#374151',
                    font: {
                        size: 12,
                        weight: '600'
                    },
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#10b981',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: '#e5e7eb',
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 11
                    }
                },
                grid: {
                    color: '#e5e7eb',
                    drawBorder: false
                },
                beginAtZero: true
            }
        },
        elements: {
            point: {
                hoverRadius: 8,
                hoverBorderWidth: 3
            }
        }
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#374151',
                    font: {
                        size: 12,
                        weight: '500'
                    },
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#10b981',
                borderWidth: 1,
                cornerRadius: 8
            }
        }
    };

    const radarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#374151',
                    font: {
                        size: 12,
                        weight: '600'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#10b981',
                borderWidth: 1,
                cornerRadius: 8
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 10
                    }
                },
                grid: {
                    color: '#e5e7eb'
                },
                pointLabels: {
                    color: '#374151',
                    font: {
                        size: 11,
                        weight: '500'
                    }
                }
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Analytics Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Analitik Dashboard</h2>
                        <p className="text-gray-600">Günlük, haftalık ve aylık performans metriklerini detaylı olarak inceleyin</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Dropdown
                            value={timeRange}
                            options={timeRangeOptions}
                            onChange={(e) => onTimeRangeChange(e.value)}
                            className="w-full sm:w-40 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                        />
                        <Calendar
                            value={selectedDate}
                            onChange={(e) => onDateChange(e.value || null)}
                            showIcon
                            className="w-full sm:w-44 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Messages Activity Chart */}
                <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Mesaj Aktivitesi</h3>
                        <div className="h-80">
                            <Chart type="line" data={chartData.messages} options={chartOptions} />
                        </div>
                    </div>
                </Card>

                {/* Response Rate Chart */}
                <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">⏱️ Yanıt Süreleri</h3>
                        <div className="h-80">
                            <Chart type="doughnut" data={chartData.responseRate} options={pieChartOptions} />
                        </div>
                    </div>
                </Card>

                {/* New Contacts Chart */}
                <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">👥 Yeni İletişimler</h3>
                        <div className="h-80">
                            <Chart type="bar" data={chartData.contacts} options={chartOptions} />
                        </div>
                    </div>
                </Card>

                {/* Message Types Chart */}
                <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">📱 Mesaj Türleri</h3>
                        <div className="h-80">
                            <Chart type="pie" data={chartData.messageTypes} options={pieChartOptions} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hourly Activity */}
                <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🕐 Saatlik Aktivite</h3>
                        <p className="text-sm text-gray-600 mb-4">24 saat boyunca mesaj aktivite yoğunluğu</p>
                        <div className="h-80">
                            <Chart type="line" data={chartData.hourlyActivity} options={chartOptions} />
                        </div>
                    </div>
                </Card>

                {/* Performance Metrics Radar */}
                <Card className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Performans Metrikleri</h3>
                        <p className="text-sm text-gray-600 mb-4">Çok boyutlu performans değerlendirmesi</p>
                        <div className="h-80">
                            <Chart type="radar" data={chartData.performanceMetrics} options={radarChartOptions} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: "Ortalama Günlük Mesaj", value: "67", icon: "📨", color: "from-green-500 to-emerald-500" },
                    { title: "Yanıt Oranı", value: "87%", icon: "✅", color: "from-blue-500 to-indigo-500" },
                    { title: "Yeni Müşteri", value: "15", icon: "👤", color: "from-purple-500 to-pink-500" },
                    { title: "Müşteri Memnuniyeti", value: "92%", icon: "😊", color: "from-orange-500 to-red-500" }
                ].map((stat, index) => (
                    <Card key={index} className={`bg-gradient-to-br ${stat.color} text-white border-0 shadow-lg`}>
                        <div className="text-center p-4">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <h4 className="text-lg font-semibold mb-1">{stat.title}</h4>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
