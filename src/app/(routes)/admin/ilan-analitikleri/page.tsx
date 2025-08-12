"use client";

import { useState, useEffect } from "react";
import { PropertyAnalyticsPage } from "@/features/property-analytics";
import { PropertyAnalyticsSkeleton } from "@/components/ui/skeleton";
import properties from "@/mocks/properties.json";

export default function AdminIlanAnalitikleriPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <PropertyAnalyticsSkeleton />;
    }

    return (
        <PropertyAnalyticsPage
            properties={properties}
        />
    );
}
