"use client";

import { AppointmentsPage } from "@/features/appointments";
import appointments from "@/mocks/appointments.json";
import statuses from "@/mocks/appointment-statuses.json";
import services from "@/mocks/services.json";
import staff from "@/mocks/staff.json";

export default function AdminAppointmentsPage() {
    return (
        <AppointmentsPage
            appointments={appointments}
            services={services}
            staff={staff}
            statuses={statuses}
        />
    );
}


