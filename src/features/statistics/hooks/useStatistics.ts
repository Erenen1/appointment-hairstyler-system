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
                        "#FF5252", "#00BCD4", "#2196F3", "#4CAF50", "#FFC107", "#9C27B0", "#FF5722"
                    ],
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                cutout: "65%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            boxWidth: 12,
                            padding: 8,
                            usePointStyle: true
                        }
                    }
                },
                maintainAspectRatio: false,
                responsive: true,
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 2,
                        borderColor: "#ffffff"
                    }
                }
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
                    backgroundColor: ["#FF5252", "#00BCD4", "#2196F3", "#4CAF50", "#FFC107"]
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                maintainAspectRatio: false,
                responsive: true,
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 20
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        },
                        grid: {
                            display: true,
                            color: '#f0f0f0'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: '#f0f0f0'
                        }
                    }
                }
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
