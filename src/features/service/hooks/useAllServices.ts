'use client';
import { useState } from "react";
import { toast } from "sonner";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import { Servis } from "../types/CreateServiceType";
import allServices from "../services/AllServicesApi";

export function useAllServices() {
    const [serviceData, setServiceData] = useState<Servis[]>([])
    const handleAllServices = async () => {
        try {
            const token = getTokenToLocalStorage()
            const res = allServices(token as string)
            setServiceData(res.data);
            toast.success('Hizmetler Getirildi', res.data);
        } catch (error) {
            toast.error('Hizmetler Getirilemedi');
            throw error;
        }
    }
    return {
        serviceData,
        handleAllServices,
    }
}