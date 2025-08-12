"use client";

import { useState, useEffect } from "react";
import { CustomersPage } from "@/features/customers";
import { CustomersPageSkeleton } from "@/components/ui/skeleton";
import customersData from "@/mocks/customers.json";

export default function AdminCustomersPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <CustomersPageSkeleton />;
    }

    return <CustomersPage customers={customersData} />;
}


