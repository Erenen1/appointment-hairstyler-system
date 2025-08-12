"use client";

import { useState, useEffect } from "react";
import SettingsPage from "@/features/settings/SettingsPage";
import { SettingsPageSkeleton } from "@/components/ui/skeleton";

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SettingsPageSkeleton />;
    }

    return <SettingsPage />;
}
