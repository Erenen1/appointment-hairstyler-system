'use client';

import { useState } from "react";
import { Customers } from "../types/CreateCustomersType";
import { toast } from "sonner";
import allCustomers from "../services/AllCustomersApi";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";


export function useAllCustomers() {
    const [data, setData] = useState<Customers[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAllCustomers = async () => {
        try {
            const token = getTokenToLocalStorage()
            setLoading(true)
            const res = await allCustomers(token as string)
            setData(res.data);
            toast.success('Müşteriler Getirildi', res)
        } catch (error) {
            toast.error('Veri alınamadı')
            throw error;
        } finally {
            setLoading(false);
        };
    }
    return {
        data,
        loading,
        handleAllCustomers,
    }

};
