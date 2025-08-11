import { useState, useMemo } from "react";
import { Property, ChartData, StatisticsStats } from "../types";

export const useStatistics = (properties: Property[]) => {
    // Charts data
    const propertyTypeChart: ChartData = useMemo(() => {
        const types = properties.reduce((acc, prop) => {
            acc[prop.category] = (acc[prop.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(types),
                datasets: [{
                    data: Object.values(types),
                    backgroundColor: [
                        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"
                    ]
                }]
            },
            options: {
                cutout: "60%",
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false
            }
        };
    }, [properties]);

    const clicksChart: ChartData = useMemo(() => {
        const topProperties = properties
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);

        return {
            data: {
                labels: topProperties.map(p => p.title.substring(0, 20) + "..."),
                datasets: [{
                    data: topProperties.map(p => p.clicks),
                    backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]
                }]
            },
            options: {
                cutout: "50%",
                plugins: { legend: { position: "right" } },
                maintainAspectRatio: false
            }
        };
    }, [properties]);

    // Statistics calculations
    const stats: StatisticsStats = useMemo(() => {
        const totalProperties = properties.length;
        const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
        const totalClicks = properties.reduce((sum, p) => sum + p.clicks, 0);
        const avgPrice = Math.round(properties.reduce((sum, p) => sum + p.price, 0) / totalProperties);

        return {
            totalProperties,
            totalViews,
            totalClicks,
            avgPrice
        };
    }, [properties]);

    return {
        // Data
        propertyTypeChart,
        clicksChart,
        stats
    };
};
