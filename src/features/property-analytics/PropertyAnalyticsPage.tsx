"use client";

import "chart.js/auto";
import { Card } from "primereact/card";
import { Property } from "./types";
import { usePropertyAnalytics } from "./hooks/usePropertyAnalytics";
import {
    AnalyticsFilters,
    StatsCards,
    AnalyticsCharts,
    PropertiesTable
} from "./components";

interface PropertyAnalyticsPageProps {
    properties?: Property[];
}

export default function PropertyAnalyticsPage({
    properties: initialProperties = []
}: PropertyAnalyticsPageProps) {
    const {
        filterState,
        setGlobalFilter,
        setTypeFilter,
        setCategoryFilter,
        setSortBy,
        setTimeRange,
        sortOptions,
        timeRangeOptions,
        uniqueTypes,
        uniqueCategories,
        filteredProperties,
        topProperties,
        stats,
        typeDistributionChart,
        performanceChart
    } = usePropertyAnalytics(initialProperties);

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">İlan Analitikleri</h1>
                <p className="text-blue-600">Emlak ilanları performans analizi ve detaylı raporlar</p>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Charts */}
            <AnalyticsCharts
                typeDistributionChart={typeDistributionChart}
                performanceChart={performanceChart}
            />

            {/* Filters and Table */}
            <Card title="İlan Listesi">
                <AnalyticsFilters
                    globalFilter={filterState.global}
                    setGlobalFilter={setGlobalFilter}
                    typeFilter={filterState.type}
                    setTypeFilter={setTypeFilter}
                    categoryFilter={filterState.category}
                    setCategoryFilter={setCategoryFilter}
                    sortBy={filterState.sortBy}
                    setSortBy={setSortBy}
                    timeRange={filterState.timeRange}
                    setTimeRange={setTimeRange}
                    sortOptions={sortOptions}
                    timeRangeOptions={timeRangeOptions}
                    uniqueTypes={uniqueTypes}
                    uniqueCategories={uniqueCategories}
                />

                <PropertiesTable
                    properties={filteredProperties}
                    globalFilter={filterState.global}
                />
            </Card>
        </div>
    );
}