
// DİKKAT: Bu sayfa sadece client component olarak kullanılmalıdır. SSR'da FullCalendar çalışmaz ve 'destroy' hatası alırsınız.
"use client";

import { useState } from "react";
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
        appointments: hookAppointments,
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
            date: apt.date,
            time: apt.time,
            customerId: apt.customerId,
            staffId: apt.staffId,
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

    // Transform data - use hook appointments if available, otherwise use initial
    const transformedAppointments = transformAppointments(hookAppointments.length > 0 ? hookAppointments : initialAppointments);
    const transformedCustomers = transformCustomers(initialCustomers);
    const transformedStaff = transformStaff(initialStaff);
    const transformedStatuses = initialStatuses; // Use the statuses passed in props

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setSelectedAppointment(null);
        setShowModal(true);
        // Test toast mesajı
        toast.info('📅 Tarih seçildi', {
            description: `${date.toLocaleDateString('tr-TR')} tarihi seçildi`,
            duration: 3000
        });
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
                toast.success('✅ Randevu başarıyla güncellendi', {
                    duration: 5000,
                    description: `${appointmentData.date} tarihindeki randevu güncellendi`
                });
                setShowModal(false);
            } else {
                // Create new appointment
                const newAppointment = await createAppointment(appointmentData);
                toast.success('✅ Yeni randevu başarıyla oluşturuldu', {
                    duration: 5000,
                    description: `${appointmentData.date} tarihinde ${appointmentData.time} saatinde randevu oluşturuldu`
                });
                setShowModal(false);
            }
        } catch (error) {
            toast.error('❌ Randevu kaydedilirken hata oluştu', {
                duration: 5000,
                description: 'Lütfen tekrar deneyin'
            });
        }
    };

    const handleDelete = async (appointmentId: number) => {
        try {
            await deleteAppointment(appointmentId);
            toast.success('✅ Randevu başarıyla silindi', {
                duration: 5000,
                description: 'Randevu takvimden kaldırıldı'
            });
            setShowModal(false);
        } catch (error) {
            toast.error('❌ Randevu silinirken hata oluştu', {
                duration: 5000,
                description: 'Lütfen tekrar deneyin'
            });
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
                        staff={transformedStaff}
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
                staff={transformedStaff}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </div>
    );
}
