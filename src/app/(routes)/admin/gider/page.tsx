"use client";

import { useState, useEffect } from "react";
import { ExpensePage } from "@/features/expense";
import { FinancialPageSkeleton } from "@/components/ui/skeleton";
import financialData from "@/mocks/financial-data.json";

export default function AdminGiderPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <FinancialPageSkeleton />;
    }

    return (
        <ExpensePage
            expenses={financialData.expenses}
        />
    );
}
