"use client";

import "chart.js/auto";
import { PackageUpgradePrompt, AnalyticsContent, useStatistics, Property } from "@/features/statistics";
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
    const {
        hasAnalyticsPackage,
        setHasAnalyticsPackage,
        isPreviewMode,
        propertyTypeChart,
        clicksChart,
        stats,
        handleMoreInfo,
        handlePreviewPackage,
        handleEndPreview
    } = useStatistics(mockProperties);

    if (hasAnalyticsPackage) {
        return (
            <AnalyticsContent
                propertyTypeChart={propertyTypeChart}
                clicksChart={clicksChart}
                stats={stats}
                isPreviewMode={isPreviewMode}
                onPurchaseClick={handleMoreInfo}
                onEndPreview={handleEndPreview}
                onDeactivatePackage={() => setHasAnalyticsPackage(false)}
            />
        );
    }

    return (
        <PackageUpgradePrompt
            onPreviewClick={handlePreviewPackage}
            onMoreInfoClick={handleMoreInfo}
        />
    );
}
