
// DİKKAT: Bu sayfa sadece client component olarak kullanılmalıdır. SSR'da FullCalendar çalışmaz ve 'destroy' hatası alırsınız.
"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarModal } from "@/components/admin";
import { Calendar } from "@/components/admin";
import { useAppointments } from "@/hooks";
import { toast } from "sonner";

interface CalendarPageProps {
    appointments?: any[];
    customers?: any[];
    services?: any[];
    staff?: any[];
    statuses?: any[];
}

export default function CalendarPage({
    appointments: initialAppointments = [],
    customers: initialCustomers = [],
    services: initialServices = [],
    staff: initialStaff = [],
    statuses: initialStatuses = []
}: CalendarPageProps) {
    const {
        createAppointment,
        updateAppointment,
        deleteAppointment
    } = useAppointments();

    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    // Transform mock data to match our interfaces
    const transformAppointments = (appointments: any[]) => {
        return appointments.map((apt: any) => ({
            id: apt.id,
            date: apt.appointmentDate,
            time: apt.startTime,
            customerId: apt.customerId,
            serviceId: apt.serviceId,
            staffId: apt.staffId,
            statusId: apt.statusId,
            notes: apt.notes
        }));
    };

    const transformCustomers = (customers: any[]) => {
        return customers.map((customer: any) => ({
            id: customer.id,
            name: customer.fullName,
            email: customer.email || '',
            phone: customer.phone
        }));
    };

    const transformServices = (services: any[]) => {
        return services.map((service: any) => ({
            id: service.id,
            name: service.title,
            price: parseFloat(service.price),
            duration: parseInt(service.duration)
        }));
    };

    const transformStaff = (staff: any[]) => {
        return staff.map((staffMember: any) => ({
            id: staffMember.id,
            name: staffMember.fullName,
            position: staffMember.specialties,
            email: staffMember.email,
            phone: staffMember.phone,
            isActive: staffMember.isActive
        }));
    };

    // Transform data
    const transformedAppointments = transformAppointments(initialAppointments);
    const transformedCustomers = transformCustomers(initialCustomers);
    const transformedServices = transformServices(initialServices);
    const transformedStaff = transformStaff(initialStaff);
    const transformedStatuses = initialStatuses;

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedAppointment(null);
        setShowModal(true);
    };

    const handleEventClick = (appointment: any) => {
        setSelectedAppointment(appointment);
        setSelectedDate(null);
        setShowModal(true);
    };

    const handleSave = async (appointmentData: any) => {
        try {
            if (selectedAppointment) {
                // Update existing appointment
                await updateAppointment(selectedAppointment.id, appointmentData);
                toast.success('Randevu başarıyla güncellendi');
            } else {
                // Create new appointment
                await createAppointment(appointmentData);
                toast.success('Randevu başarıyla oluşturuldu');
            }
            setShowModal(false);
        } catch (error) {
            toast.error('Randevu kaydedilirken hata oluştu');
        }
    };

    const handleDelete = async (appointmentId: number) => {
        try {
            await deleteAppointment(appointmentId);
            toast.success('Randevu başarıyla silindi');
            setShowModal(false);
        } catch (error) {
            toast.error('Randevu silinirken hata oluştu');
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Randevu Takvimi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Calendar
                        appointments={transformedAppointments}
                        customers={transformedCustomers}
                        services={transformedServices}
                        staff={transformedStaff}
                        statuses={transformedStatuses}
                        onDateClickAction={handleDateClick}
                        onEventClickAction={handleEventClick}
                    />
                </CardContent>
            </Card>

            <CalendarModal
                visible={showModal}
                onHide={() => setShowModal(false)}
                selectedDate={selectedDate}
                selectedAppointment={selectedAppointment}
                customers={transformedCustomers}
                services={transformedServices}
                staff={transformedStaff}
                statuses={transformedStatuses}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </div>
    );
}
