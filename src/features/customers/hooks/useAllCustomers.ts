'use client';

import { useState } from "react";
import { Customers } from "../types/CreateCustomersType";
import { toast } from "sonner";


export function useAllCustomers() {
    const [data, setData] = useState<Customers[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAllCustomers = async () => {
        try {
            setLoading(true)
            const res = await fetch('json/customers.json')
            const json = await res.json()
            setData(json);
            toast.success('Müşteriler Getirildi', json)
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
