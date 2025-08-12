"use client";

import { useState, useEffect } from "react";
import CalendarPage from "@/features/calendar/components/CalendarPage";
import { AdminDashboardSkeleton } from "@/components/ui/skeleton";
import appointments from "@/mocks/appointments.json";
import customers from "@/mocks/customers.json";
import services from "@/mocks/services.json";
import staff from "@/mocks/staff.json";
import statuses from "@/mocks/appointment-statuses.json";

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <AdminDashboardSkeleton />;
    }

    return (
        <CalendarPage
            appointments={appointments}
            customers={customers}
            services={services}
            staff={staff}
            statuses={statuses}
        />
    );
}