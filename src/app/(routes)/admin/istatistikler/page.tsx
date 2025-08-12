"use client";

import { useState, useEffect } from "react";
import "chart.js/auto";
import { AnalyticsContent, useStatistics, Property } from "@/features/statistics";
import { StatisticsPageSkeleton } from "@/components/ui/skeleton";
import properties from "@/mocks/properties.json";

// Transform properties data for analytics
const mockProperties: Property[] = properties.map(p => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.price,
    views: p.views,
    clicks: p.clicks,
    type: p.type,
    category: p.category,
    featured: p.featured,
    agentId: p.agentId,
    area: p.area,
    rooms: p.rooms,
    createdAt: p.createdAt
}));

export default function IstatistiklerPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Always call useStatistics hook, regardless of loading state
    const {
        propertyTypeChart,
        clicksChart,
        stats
    } = useStatistics(mockProperties);

    if (isLoading) {
        return <StatisticsPageSkeleton />;
    }

    return (
        <AnalyticsContent
            propertyTypeChart={propertyTypeChart}
            clicksChart={clicksChart}
            stats={stats}
        />
    );
}
