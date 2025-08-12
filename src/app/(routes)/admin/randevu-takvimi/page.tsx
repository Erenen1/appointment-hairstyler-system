"use client";

import { useState, useEffect } from "react";
import CalendarPage from "@/features/calendar/components/CalendarPage";
import { PageSkeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import appointments from "@/mocks/appointments.json";
import customers from "@/mocks/customers.json";
import staff from "@/mocks/staff.json";

export default function AdminRandevuTakvimi() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <PageSkeleton />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Randevu Takvimi"
                description="Müşteri randevularını görüntüleyin, yeni randevu oluşturun ve mevcut randevuları yönetin."
                icon="pi pi-calendar"
                iconBgColor="from-blue-500 to-indigo-600"
                gradientFrom="from-blue-50"
                gradientTo="to-indigo-100"
                borderColor="border-blue-200"
            />

            <CalendarPage
                appointments={appointments}
                customers={customers}
                staff={staff}
            />
        </div>
    );
}