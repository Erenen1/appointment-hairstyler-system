"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { useAllStaff } from "@/features/staff/hooks/useAllStaff";
import { StaffCalendarBody } from "./CalendarBody";

import CalendarHeader from "./CalendarHeader";
import { Staff } from "@/features/staff/types/StaffType";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCcw, Trash } from "lucide-react";
import CreateAppointmentModal from "./CreateAppointmentModal copy 2";

export const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
});

export type AppointmentStatus = "confirmed" | "pending" | "completed";

export type Appointment = {
    staffId: string;
    time: string;
    customer: string;
    service: string;
    status: AppointmentStatus;
    phone: string;
};

export default function StaffCalendarPage() {
    const [selectedSlot, setSelectedSlot] = useState<{ staffId: string; time: string } | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const { staffData, handleAllStaff } = useAllStaff();
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        handleAllStaff();
    }, []);

    // Personel verileri geldikten sonra appointment'ları yükle
    useEffect(() => {
        if (staffData.length >= 3) {
            const initialAppointments: Appointment[] = [
                {
                    staffId: staffData[0]?.id,
                    time: "09:00",
                    customer: "Ali",
                    phone: "555-1234",
                    service: "Saç Kesimi",
                    status: "confirmed",
                },
                {
                    staffId: staffData[1]?.id,
                    time: "10:00",
                    customer: "Ayhan",
                    phone: "555-1234",
                    service: "Cilt Bakımı",
                    status: "pending",
                },
                {
                    staffId: staffData[2]?.id,
                    time: "11:00",
                    customer: "Selin",
                    phone: "555-1234",
                    service: "Manikür",
                    status: "completed",
                },
                {
                    staffId: staffData[0]?.id,
                    time: "13:00",
                    customer: "Gizem",
                    phone: "555-1234",
                    service: "Kaş Alımı",
                    status: "confirmed",
                },
                {
                    staffId: staffData[1]?.id,
                    time: "13:00",
                    customer: "Okan",
                    phone: "555-1234",
                    service: "Saç Boyama",
                    status: "pending",
                },
            ].filter((a) => a.staffId !== undefined);
            setAllAppointments(initialAppointments);
        }
    }, [staffData]);

    const openModal = (staffId: string, time: string) => {
        setSelectedSlot({ staffId, time });
        setModalOpen(true);
    };
    const handleDeleteAppointment = (staffId: string, time: string) => {
        setAllAppointments((prev) =>
            prev.filter((appointment) => !(appointment.staffId === staffId && appointment.time === time))
        );
    }


    if (!staffData.length) return <div className="p-4">Yükleniyor...</div>;

    const existingAppointment = allAppointments.find(
        (a) => a.staffId === selectedSlot?.staffId && a.time === selectedSlot?.time
    );

    return (
        <div className="h-[calc(100vh-100px)] overflow-y-hidden p-4">
            <h2 className="text-xl font-bold mb-4">Randevu Takvimi</h2>

            <div className="overflow-x-auto border rounded-lg h-full">
                <div
                    className="grid h-full"
                    style={{
                        gridTemplateColumns: `100px repeat(${staffData.length}, 1fr)`,
                        minHeight: "100%",
                    }}
                >
                    <CalendarHeader staffData={staffData.filter((staff): staff is Staff => staff.id != null)} />

                    <StaffCalendarBody
                        staffData={staffData}
                        timeSlots={timeSlots}
                        appointments={allAppointments}
                        phone=""
                        onCellClick={openModal}
                        onDeleteAppointment={handleDeleteAppointment}

                    />
                </div>
            </div>

            <CreateAppointmentModal open={isModalOpen} onOpenChange={setModalOpen} title="Yeni Randevu">
                <div className="space-y-2">

                    <p className="text-sm text-muted-foreground">
                        <strong>Çalışan:</strong>{" "}
                        {staffData.find((s) => s.id === selectedSlot?.staffId)?.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        <strong>Saat:</strong> {selectedSlot?.time}
                    </p>
                    <div className="space-y-1">
                        <Input
                            placeholder="Müşteri Adı"
                            className="w-full border rounded px-3 py-2 text-sm"
                            defaultValue={existingAppointment?.customer ?? ""}
                        />
                        <Input
                            placeholder="Hizmet"
                            className="w-full border rounded px-3 py-2 text-sm"
                            defaultValue={existingAppointment?.service ?? ""}
                        />
                        <select
                            className="w-full border rounded px-3 py-2 text-sm"
                            defaultValue={existingAppointment?.status ?? "confirmed"}
                        >
                            <option value="confirmed">Onaylandı</option>
                            <option value="pending">Bekliyor</option>
                            <option value="completed">Tamamlandı</option>
                        </select>
                    </div>

                    {existingAppointment ? (
                        <Button className="flex items-center justify-center space-x-2 w-full">
                            <RefreshCcw className="w-5 h-5 text-green-500" />
                            <p>Randevu Güncelle</p>
                        </Button>
                    ) : (
                        <Button className="flex items-center justify-center space-x-2 w-full">
                            <Plus className="w-5 h-5 text-green-500" />
                            <p>Randevu Oluştur</p>
                        </Button>
                    )}
                </div>
            </CreateAppointmentModal>
        </div>
    );
}
