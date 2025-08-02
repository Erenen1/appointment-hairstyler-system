// "use client";

// import React, { useEffect, useState } from "react";

// import { useAllStaff } from "@/features/staff/hooks/useAllStaff";
// import { StaffCalendarBody } from "./CalendarAppointmentBody";

// import CalendarHeader from "./CalendarAppointmentHeader";
// import { Staff } from "@/features/staff/types/StaffType";
// import CalendarAppointmentLayout from "./CalendarAppointmentLayout";
// import CalendarAppointmentForm from "./CalendarAppointmentForm";

// export const timeSlots = Array.from({ length: 10 }, (_, i) => {
//     const hour = 9 + i;
//     return `${hour.toString().padStart(2, "0")}:00`;
// });

// export type AppointmentStatus = "confirmed" | "pending" | "completed";

// export type Appointment = {
//     staffId: string;
//     time: string;
//     customer: string;
//     service: string;
//     status: AppointmentStatus;
//     phone: string;
// };

// export default function StaffCalendarPage() {
//     const [selectedSlot, setSelectedSlot] = useState<{ staffId: string; time: string } | undefined>(undefined);
//     const [isModalOpen, setModalOpen] = useState<boolean>(false);
//     const { staffData, handleAllStaff } = useAllStaff();
//     const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

//     useEffect(() => {
//         handleAllStaff();
//     }, []);

//     // Personel verileri geldikten sonra appointment'ları yükle
//     useEffect(() => {
//         if (staffData.length >= 3 && staffData[0]?.id && staffData[1]?.id && staffData[2]?.id) {
//             const initialAppointments: Appointment[] = [
//                 {
//                     staffId: staffData[0].id,
//                     time: "09:00",
//                     customer: "Ali",
//                     phone: "555-1234",
//                     service: "Saç Kesimi",
//                     status: "confirmed" as AppointmentStatus,
//                 },
//                 {
//                     staffId: staffData[1].id,
//                     time: "10:00",
//                     customer: "Ayhan",
//                     phone: "555-1234",
//                     service: "Cilt Bakımı",
//                     status: "pending" as AppointmentStatus,
//                 },
//                 {
//                     staffId: staffData[2].id,
//                     time: "11:00",
//                     customer: "Selin",
//                     phone: "555-1234",
//                     service: "Manikür",
//                     status: "completed" as AppointmentStatus,
//                 },
//                 {
//                     staffId: staffData[0].id,
//                     time: "13:00",
//                     customer: "Gizem",
//                     phone: "555-1234",
//                     service: "Kaş Alımı",
//                     status: "confirmed" as AppointmentStatus,
//                 },
//                 {
//                     staffId: staffData[1].id,
//                     time: "13:00",
//                     customer: "Okan",
//                     phone: "555-1234",
//                     service: "Saç Boyama",
//                     status: "pending" as AppointmentStatus,
//                 },
//             ];
//             setAllAppointments(initialAppointments);
//         }
//     }, [staffData]);

//     const openModal = (staffId: string, time: string) => {
//         setSelectedSlot({ staffId, time });
//         setModalOpen(true);
//     };
//     const handleDeleteAppointment = (staffId: string, time: string) => {
//         setAllAppointments((prev) =>
//             prev.filter((appointment) => !(appointment.staffId === staffId && appointment.time === time))
//         );
//     }


//     if (!staffData.length) return <div className="p-4">Yükleniyor...</div>;

//     const existingAppointment = allAppointments.find(
//         (a) => a.staffId === selectedSlot?.staffId && a.time === selectedSlot?.time
//     );

//     return (
//         <div className="h-[calc(100vh-100px)] !overflow-y-hidden p-4">
//             <h2 className="text-xl font-bold mb-4">Randevu Takvimi</h2>

//             <div className="overflow-x-auto border rounded-lg h-full">
//                 <div
//                     className="grid h-full"
//                     style={{
//                         gridTemplateColumns: `100px repeat(${staffData.length}, 1fr)`,
//                         minHeight: "100%",
//                     }}
//                 >
//                     <CalendarHeader staffData={staffData.filter((staff): staff is Staff => staff.id != null)} />

//                     <StaffCalendarBody
//                         staffData={staffData}
//                         timeSlots={timeSlots}
//                         appointments={allAppointments}
//                         phone=""
//                         onCellClick={openModal}
//                         onDeleteAppointment={handleDeleteAppointment}

//                     />
//                 </div>
//             </div>
//             <CalendarAppointmentLayout open={isModalOpen} onOpenChange={setModalOpen}>
//                 <CalendarAppointmentForm
//                     staffData={staffData}
//                     existingAppointment={existingAppointment}
//                     onSubmit={() => {
//                         // Handle form submission
//                     }}
//                     isSubmitting={false}
//                     selectedSlot={selectedSlot}
//                 />
//             </CalendarAppointmentLayout>
//             {/*
//             <CalendarAppointmentLayout open={isModalOpen} onOpenChange={setModalOpen}>
//                 <div className="space-y-4">
//                     <h3 className="text-lg font-semibold mx-auto text-center">
//                         {existingAppointment ? "Randevu Güncelle" : "Yeni Randevu Oluştur"}
//                     </h3>
//                     <div className="flex items-center space-x-4">
//                         <p className="text-sm text-muted-foreground">
//                             <strong>Personel:</strong>{" "}
//                             {staffData.find((s) => s.id === selectedSlot?.staffId)?.fullName}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                             <strong>Seçilen Saat:</strong> {selectedSlot?.time}
//                         </p>
//                     </div>
//                     <div className="space-y-1">
//                         <Label className="text-sm">Müşteri Adı</Label>
//                         <Input
//                             placeholder="Selin Yılmaz"
//                             className="w-full border rounded px-3 py-2 text-sm"
//                             defaultValue={existingAppointment?.customer ?? ""}
//                         />
//                         <Label className="text-sm">Hizmet Türü</Label>
//                         <Input
//                             placeholder="Sakal Traşı"
//                             className="w-full border rounded px-3 py-2 text-sm"
//                             defaultValue={existingAppointment?.service ?? ""}
//                         />
//                         <div className="!w-full">
//                             <Select defaultValue={existingAppointment?.status ?? "confirmed"}>
//                                 <Label className="text-sm">Hizmet Durumu</Label>
//                                 <SelectTrigger className="!w-full">
//                                     <SelectValue placeholder="Hizmet Durumu" />
//                                 </SelectTrigger>
//                                 <SelectContent className="!w-full">
//                                     <SelectItem value="confirmed">Onaylandı</SelectItem>
//                                     <SelectItem value="pending">Bekliyor</SelectItem>
//                                     <SelectItem value="completed">Tamamlandı</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

//                     {existingAppointment ? (
//                         <Button className="flex items-center justify-center space-x-2 w-full">
//                             <RefreshCcw className="w-5 h-5 text-green-500" />
//                             <p>Randevu Güncelle</p>
//                         </Button>
//                     ) : (
//                         <Button className="flex items-center justify-center space-x-2 w-full">
//                             <Plus className="w-5 h-5 text-green-500" />
//                             <p>Randevu Oluştur</p>
//                         </Button>
//                     )}
//                 </div>
//             </CalendarAppointmentLayout> */}
//         </div>
//     );
// }
'use client';

import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import trLocale from '@fullcalendar/core/locales/tr';


import CalendarDialog from './CalendarAppointmentDialog';
import CalendarAppointmentForm from './CalendarAppointmentForm';
import { useAllAppointments } from '@/features/appointments/hooks/useAllAppointments';
import { Appointment } from '@/features/appointments/types/AppointmentType';

const AllCalendar = () => {
    const [events, setEvents] = React.useState<Appointment[]>([]);
    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

    const { appointmentData, handleAllAppointments } = useAllAppointments()


    useEffect(() => {
        if (appointmentData?.length === 0) handleAllAppointments();
        console.log("Tüm randevular:", appointmentData);
    }, []);

    const handleDateClick = (arg: { dateStr: string }) => {
        setSelectedDate(arg.dateStr);
        setDialogOpen(true);
    };

    const handleAddEvent = (appointment: Appointment) => {
        setEvents((prev) => [...prev, appointment]);
    };
    return (
        <div className='max-w-7xl mx-auto p-4 h-[calc(100vh-100px)] overflow-hidden'>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
                locale={trLocale}
                weekends={true}
                events={
                    events.length > 0
                        ? (events ?? []).map((event) => ({
                            id: event.id.toString(),
                            title: `${event.customerId}: ${event.serviceId}`,
                            start: event.startTime,
                            end: event.endTime,
                            allDay: false,
                            extendedProps: {
                                ...event,
                            },
                        }))
                        : (appointmentData ?? []).map((appointment) => ({
                            id: appointment.id.toString(),
                            title: `${appointment.customerId}: ${appointment.serviceId}`,
                            start: appointment.startTime,
                            end: appointment.endTime,
                            allDay: false,
                            extendedProps: {
                                ...appointment,
                            },
                        }))
                }
                eventClick={(info) => {
                    const appointmentId = info.event.id;
                    const appointmentDate = info.event.extendedProps as Appointment
                    console.log('Seçilen Randevu Idsi', appointmentId);
                    console.log('Seçilen Randevu Bilgileri:', appointmentDate);
                }}
                // // dayHeaders={true}
                initialView="dayGridMonth"
                dateClick={handleDateClick}
                editable={true}
                initialDate={new Date()}
                allDaySlot={true}
                // contentHeight={800} // <--- yüksekliği burada sınırlıyoruz
                slotMinTime={'08:00:00'}
                slotMaxTime={'21:00:00'}
                themeSystem="flaty"
                expandRows={true}
                height="auto"
                dayHeaderFormat={{ weekday: 'short' }} // "Pazartesi"
                titleFormat={{
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                }}
            />

            <CalendarDialog
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                selectedDate={selectedDate}
            >
                <CalendarAppointmentForm
                    onSubmit={(data: Appointment) => {
                        handleAddEvent(data);
                        setDialogOpen(false);
                    }}
                />
            </CalendarDialog>
        </div >
    );
};

export default AllCalendar;