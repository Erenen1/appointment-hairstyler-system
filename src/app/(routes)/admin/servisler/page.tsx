"use client";

import { ServicesPage } from "@/features/services";
import services from "@/mocks/services.json";
import categories from "@/mocks/service-categories.json";

export default function AdminServicesPage() {
    return (
        <ServicesPage
            services={services}
            categories={categories}
        />
    );
}


