"use client";

import { useState, useEffect } from "react";
import { CurrentAccountsPage } from "@/features/current-accounts";
import { PageSkeleton } from "@/components/ui/skeleton";
import financialData from "@/mocks/financial-data.json";

export default function AdminCariPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <PageSkeleton />;
    }

    return (
        <CurrentAccountsPage
            customers={financialData.customers}
        />
    );
}
