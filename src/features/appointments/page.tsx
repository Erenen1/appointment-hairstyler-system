"use client";

import AppointmentsPage from './AppointmentsPage';
import appointmentsData from '../../../mocks/appointments.json';
import appointmentStatusesData from '../../../mocks/appointment-statuses.json';
import servicesData from '../../../mocks/services.json';
import staffData from '../../../mocks/staff.json';

export default function AppointmentsPageWrapper() {
    return (
        <AppointmentsPage
            appointments={appointmentsData}
            services={servicesData}
            staff={staffData}
            statuses={appointmentStatusesData}
        />
    );
}