'use client';

import { useState } from "react";
import { Customers } from "../types/CreateCustomersType";
import { toast } from "sonner";
import allCustomers from "../services/AllCustomersApi";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";


export function useAllCustomers() {
    const [customerData, setCustomerData] = useState<Customers[]>([]);

    const handleAllCustomers = async () => {
        try {
            const token = getTokenToLocalStorage()
            const res = await allCustomers(token as string)
            setCustomerData(res.data);
            toast.success('Müşteriler Getirildi', res)
        } catch (error) {
            toast.error('Veri alınamadı')
            throw error;
        }
    }
    return {
        customerData,
        handleAllCustomers,
    }

};
