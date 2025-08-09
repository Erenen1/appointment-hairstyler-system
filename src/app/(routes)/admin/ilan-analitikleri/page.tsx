"use client";

import { PropertyAnalyticsPage } from "@/features/property-analytics";
import properties from "@/mocks/properties.json";

export default function AdminIlanAnalitikleriPage() {
    return (
        <PropertyAnalyticsPage
            properties={properties}
        />
    );
}
