'use client';
import { useState } from "react";
import { toast } from "sonner";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import { Service } from "../types/ServiceType";
import allServices from "../services/AllServicesApi";
import { filterData } from "@/hooks/filterService";

export function useAllService() {
    const [serviceData, setServiceData] = useState<Service[]>([]);
    const [filteredServiceData, setFilteredServiceData] = useState<Service[]>([]);

    const handleAllServices = async () => {
        try {
            const token = getTokenToLocalStorage()
            const res = await allServices(token as string)
            setFilteredServiceData(res.data)
            setServiceData(res.data);
            toast.success('Hizmetler Getirildi', res.data);
        } catch (error) {
            toast.error('Hizmetler Getirilemedi');
            throw error;
        }
    }

    const filterServices = (searchTerm: string) => {
        const result = filterData(serviceData, searchTerm);
        setFilteredServiceData(result);
    };

    return {
        serviceData: filteredServiceData,
        filterServices,
        handleAllServices,
    }
}