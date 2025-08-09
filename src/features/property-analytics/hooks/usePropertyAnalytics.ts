import { useState, useMemo } from "react";
import { Property, SortOption, TimeRangeOption, FilterState, ChartConfig } from "../types";

export const usePropertyAnalytics = (initialProperties: Property[]) => {
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>("clicks");
    const [timeRange, setTimeRange] = useState<string>("week");

    const sortOptions: SortOption[] = [
        { label: "En Çok Tıklanan", value: "clicks" },
        { label: "En Çok Görüntülenen", value: "views" },
        { label: "En Yeni", value: "createdAt" },
        { label: "En Pahalı", value: "price" }
    ];

    const timeRangeOptions: TimeRangeOption[] = [
        { label: "Bu Hafta", value: "week" },
        { label: "Bu Ay", value: "month" },
        { label: "Bu Yıl", value: "year" },
        { label: "Tüm Zamanlar", value: "all" }
    ];

    const uniqueTypes = useMemo(() => {
        return Array.from(new Set(initialProperties.map(p => p.type)));
    }, [initialProperties]);

    const uniqueCategories = useMemo(() => {
        return Array.from(new Set(initialProperties.map(p => p.category)));
    }, [initialProperties]);

    const filteredProperties = useMemo(() => {
        let filtered = [...initialProperties];

        if (globalFilter) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(globalFilter.toLowerCase()) ||
                p.location.toLowerCase().includes(globalFilter.toLowerCase())
            );
        }

        if (typeFilter.length > 0) {
            filtered = filtered.filter(p => typeFilter.includes(p.type));
        }

        if (categoryFilter.length > 0) {
            filtered = filtered.filter(p => categoryFilter.includes(p.category));
        }

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "clicks":
                    return b.clicks - a.clicks;
                case "views":
                    return b.views - a.views;
                case "price":
                    return b.price - a.price;
                case "createdAt":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });
    }, [initialProperties, globalFilter, typeFilter, categoryFilter, sortBy]);

    const topProperties = useMemo(() => {
        return filteredProperties.slice(0, 10);
    }, [filteredProperties]);

    const stats = useMemo(() => {
        const totalViews = filteredProperties.reduce((sum, p) => sum + p.views, 0);
        const totalClicks = filteredProperties.reduce((sum, p) => sum + p.clicks, 0);
        const avgPrice = filteredProperties.length > 0
            ? filteredProperties.reduce((sum, p) => sum + p.price, 0) / filteredProperties.length
            : 0;
        const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

        return {
            totalProperties: filteredProperties.length,
            totalViews,
            totalClicks,
            avgPrice,
            clickRate
        };
    }, [filteredProperties]);

    const typeDistributionChart: ChartConfig = useMemo(() => {
        const typeCount = filteredProperties.reduce((acc, p) => {
            acc[p.type] = (acc[p.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(typeCount),
                datasets: [{
                    label: "İlan Sayısı",
                    data: Object.values(typeCount),
                    backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]
                }]
            },
            options: {
                cutout: "60%",
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false
            }
        };
    }, [filteredProperties]);

    const performanceChart: ChartConfig = useMemo(() => {
        const topPerformers = filteredProperties.slice(0, 5);

        return {
            data: {
                labels: topPerformers.map(p => p.title.substring(0, 15) + "..."),
                datasets: [
                    {
                        label: "Görüntüleme",
                        data: topPerformers.map(p => p.views),
                        backgroundColor: "#4ECDC4"
                    },
                    {
                        label: "Tıklama",
                        data: topPerformers.map(p => p.clicks),
                        backgroundColor: "#FF6B6B"
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: "top" } },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        };
    }, [filteredProperties]);

    const filterState: FilterState = {
        global: globalFilter,
        type: typeFilter,
        category: categoryFilter,
        sortBy,
        timeRange
    };

    return {
        // State
        filterState,
        setGlobalFilter,
        setTypeFilter,
        setCategoryFilter,
        setSortBy,
        setTimeRange,

        // Options
        sortOptions,
        timeRangeOptions,
        uniqueTypes,
        uniqueCategories,

        // Data
        filteredProperties,
        topProperties,
        stats,
        typeDistributionChart,
        performanceChart
    };
};
