
// DİKKAT: Bu bileşen sadece client component'larda kullanılmalıdır. SSR'da FullCalendar çalışmaz ve 'destroy' hatası alırsınız.
"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
const FullCalendar = dynamic(() => import("@fullcalendar/react"), { ssr: false });
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import trLocale from "@fullcalendar/core/locales/tr";

interface Appointment {
    id: number;
    date: string;
    time: string;
    customerId: number;
    serviceId: number;
    staffId: number;
    statusId: number;
    notes?: string;
}

interface Customer {
    id: number;
    name: string;
}

interface Service {
    id: number;
    name: string;
}

interface Staff {
    id: number;
    name: string;
}

interface AppointmentStatus {
    id: number;
    name: string;
    color: string;
}

interface CalendarProps {
    appointments: Appointment[];
    customers: Customer[];
    services: Service[];
    staff: Staff[];
    statuses: AppointmentStatus[];
    onDateClickAction: (date: Date) => void;
    onEventClickAction: (appointment: Appointment) => void;
}

export default function Calendar({
    appointments,
    customers,
    services,
    staff,
    statuses,
    onDateClickAction,
    onEventClickAction
}: CalendarProps) {
    const events = useMemo(() => {
        return appointments.map(appointment => {
            const customer = customers.find(c => c.id === appointment?.customerId || 0);
            const service = services.find(s => s.id === appointment?.serviceId || 0);
            const staffMember = staff.find(s => s.id === appointment?.staffId || 0);
            const status = statuses.find(s => s.id === appointment?.statusId || 0);

            return {
                id: appointment.id.toString(),
                title: `${customer?.name || 'Bilinmeyen'} - ${service?.name || 'Bilinmeyen'}`,
                start: `${appointment.date}T${appointment.time}`,
                end: `${appointment.date}T${appointment.time}`,
                backgroundColor: status?.color || '#6c757d',
                borderColor: status?.color || '#6c757d',
                textColor: '#ffffff',
                extendedProps: {
                    appointment: appointment
                }
            };
        });
    }, [appointments, customers, services, staff, statuses]);

    const handleDateClick = (arg: { date: Date }) => {
        onDateClickAction(arg.date);
    };

    const handleEventClick = (arg: any) => {
        const appointment = arg.event.extendedProps.appointment as Appointment;
        onEventClickAction(appointment);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay"
                }}
                locale={trLocale}
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height="auto"
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                firstDay={1}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: '09:00',
                    endTime: '20:00',
                }}
                slotMinTime="09:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                slotDuration="00:30:00"
                slotLabelInterval="01:00"
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                eventDisplay="block"
                eventColor="#3b82f6"
                eventTextColor="#ffffff"
                eventBorderColor="#1d4ed8"
                dayHeaderFormat={{ weekday: 'long' }}
                titleFormat={{ month: 'long', year: 'numeric' }}
                buttonText={{
                    today: 'Bugün',
                    month: 'Ay',
                    week: 'Hafta',
                    day: 'Gün'
                }}
                moreLinkText="+{count} daha"
                noEventsText="Bu tarihte randevu bulunmuyor"
                // loading prop'u kaldırıldı, FullCalendar'da bu prop bir fonksiyon olmalı
                eventDidMount={(info) => {
                    // Add custom styling or tooltips if needed
                    const eventEl = info.el;
                    if (eventEl) {
                        eventEl.style.cursor = 'pointer';
                        eventEl.title = info.event.title;
                    }
                }}
            />
        </div>
    );
}

