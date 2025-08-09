"use client";

import CalendarPage from "@/features/calendar/components/CalendarPage";
import appointments from "@/mocks/appointments.json";
import customers from "@/mocks/customers.json";
import services from "@/mocks/services.json";
import staff from "@/mocks/staff.json";
import statuses from "@/mocks/appointment-statuses.json";

export default function AdminDashboard() {
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