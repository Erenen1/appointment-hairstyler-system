'use client';

import { useState } from "react";
import { toast } from "sonner";
import allCustomers from "../services/AllCustomersApi";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import { Customer } from "../types/CustomersType";
import { filterData } from "@/hooks/filterService";


export function useAllCustomers() {
    const [customerData, setCustomerData] = useState<Customer[]>([]);
    const [filteredCustomerData, setFilterCustomerData] = useState<Customer[]>([]);

    const handleAllCustomers = async () => {
        try {
            const token = getTokenToLocalStorage();
            const res = await allCustomers(token as string);
            setCustomerData(res.data);
            setFilterCustomerData(res.data);
            toast.success('Müşteriler Getirildi', res)
        } catch (error) {
            toast.error('Veri alınamadı')
            throw error;
        }
    };
    const filterCustomer = (searchTerm: string) => {
        const result = filterData(customerData, searchTerm);
        setFilterCustomerData(result);
    };

    return {
        customerData: filteredCustomerData,
        filterCustomer,
        handleAllCustomers,
    }

};
