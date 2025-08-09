"use client";
import Link from "next/link";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";

interface Appointment {
    id: number;
    customerId: number;
    staffId: number;
    serviceId: number;
    statusId: number;
    appointmentDate: string;
    startTime: string;
    endTime: string;
}

interface Status {
    id: number;
    displayName: string;
    color: string;
}

interface AdminDashboardProps {
    appointments: Appointment[];
    services: { id: number }[];
    statuses: Status[];
}

export default function AdminDashboard({ appointments, services, statuses }: AdminDashboardProps) {
    const total = appointments.length;
    const byStatus = statuses.map((s) => ({
        label: s.displayName,
        value: appointments.filter((a) => a.statusId === s.id).length,
        color: s.color,
    }));

    const doughnutData = {
        labels: byStatus.map((x) => x.label),
        datasets: [{ data: byStatus.map((x) => x.value), backgroundColor: byStatus.map((x) => x.color) }],
    };

    const doughnutOptions = { cutout: "60%" } as Record<string, unknown>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Admin Dashboard</h1>
                <p className="text-blue-600">Sistem genel durumu ve istatistikler</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{total}</div>
                        <div className="text-lg font-semibold text-blue-800">Toplam Randevu</div>
                        <div className="text-sm text-blue-600">Genel toplam</div>
                    </div>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{services.length}</div>
                        <div className="text-lg font-semibold text-blue-800">Hizmetler</div>
                        <div className="text-sm text-blue-600">Aktif hizmet sayısı</div>
                    </div>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-blue-800 mb-3">Durum Dağılımı</div>
                        <Chart type="doughnut" data={doughnutData} options={doughnutOptions} />
                    </div>
                </Card>
            </div>

            {/* Navigation Cards */}
            <div className="grid md:grid-cols-4 gap-6">
                <Link href="/admin/randevu-takvimi" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-calendar text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Randevu Takvimi</div>
                            <div className="text-sm text-blue-600">Takvim görünümü</div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/randevular" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-chart-line text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Randevular</div>
                            <div className="text-sm text-blue-600">Grafik ve liste</div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/musteriler" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-users text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Müşteriler</div>
                            <div className="text-sm text-blue-600">Liste ve detay</div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/personeller" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-id-card text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Personeller</div>
                            <div className="text-sm text-blue-600">Çalışma günleri ve yük</div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/servisler" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-briefcase text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Servisler</div>
                            <div className="text-sm text-blue-600">Fiyat ve süre</div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/cari" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-credit-card text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Cari</div>
                            <div className="text-sm text-blue-600">Müşteri bakiyeleri</div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/adisyon" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-receipt text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Adisyon</div>
                            <div className="text-sm text-blue-600">Fatura ve ödemeler</div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/gelir" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-arrow-up text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Gelir</div>
                            <div className="text-sm text-blue-600">Gelir takibi</div>
                        </div>
                    </Card>
                </Link>

                <Link href="/admin/gider" className="no-underline group">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
                        <div className="text-center p-4">
                            <i className="pi pi-arrow-down text-4xl text-blue-600 mb-3"></i>
                            <div className="text-lg font-semibold text-blue-800">Gider</div>
                            <div className="text-sm text-blue-600">Gider takibi</div>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
