"use client";

import { useState, useEffect } from "react";
import { AppointmentsPage } from "@/features/appointments";
import { AppointmentsPageSkeleton } from "@/components/ui/skeleton";
import appointments from "@/mocks/appointments.json";
import statuses from "@/mocks/appointment-statuses.json";
import services from "@/mocks/services.json";
import staff from "@/mocks/staff.json";

export default function AdminAppointmentsPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <AppointmentsPageSkeleton />;
    }

    return (
        <AppointmentsPage
            appointments={appointments}
            services={services}
            staff={staff}
            statuses={statuses}
        />
    );
}


