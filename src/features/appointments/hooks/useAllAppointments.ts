'use client';
import { useState } from "react";
import { toast } from "sonner";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import { Randevu } from "@/app/share/table/mock/randevu-mock-data";
import allAppointments from "../services/AllAppointmentsApi";

export function useAllAppointments() {
    const [data, setData] = useState<Randevu[]>([])
    const [loading, setLoading] = useState(false)
    const handleAllAppointments = async () => {
        try {
            const token = getTokenToLocalStorage()
            const res = await allAppointments(token as string)
            setData(res.data);
            toast.success('Randevu Getirildi', res);
        } catch (error) {
            toast.error('Randevu Getirilemedi');
            throw error;
        } finally {
            setLoading(false);
        }
    }
    return {
        data,
        loading,
        handleAllAppointments,
    }
}