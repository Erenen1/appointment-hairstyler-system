'use client';
import { useState } from "react";
import { toast } from "sonner";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import allAppointments from "../services/AllAppointmentsApi";
import { Appointment } from "../types/AppointmentType";
import { filterData } from "@/hooks/filterService";

export function useAllAppointments() {
    const [appointmentData, setAppointmentData] = useState<Appointment[]>([]);
    const [filteredAppointmentData, setFilteredAppointmentData] = useState<Appointment[]>([]);

    const handleAllAppointments = async () => {
        try {
            const token = getTokenToLocalStorage()
            const res = await allAppointments(token as string)
            setFilteredAppointmentData(res.data);
            setAppointmentData(res.data);
            toast.success('Randevu Getirildi', res);
        } catch (error) {
            toast.error('Randevu Getirilemedi');
            throw error;
        }
    }

    const filterAppointment = (searchTerm: string) => {
        const result = filterData(appointmentData, searchTerm);
        setFilteredAppointmentData(result);
    };
    return {
        appointmentData: filteredAppointmentData,
        filterAppointment,
        handleAllAppointments,
    }
}