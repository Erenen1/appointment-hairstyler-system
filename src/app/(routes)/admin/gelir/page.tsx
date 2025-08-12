"use client";

import { useState, useEffect } from "react";
import { IncomePage } from "@/features/income";
import { FinancialPageSkeleton } from "@/components/ui/skeleton";
import financialData from "@/mocks/financial-data.json";

export default function AdminGelirPage() {
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
        <IncomePage
            income={financialData.income}
        />
    );
}
