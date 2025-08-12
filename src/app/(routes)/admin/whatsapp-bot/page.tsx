"use client";

import { useState, useEffect } from "react";
import { WhatsAppBotPage } from "@/features/whatsapp-bot";
import { WhatsAppBotSkeleton } from "@/components/ui/skeleton";

export default function AdminWhatsAppBotPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <WhatsAppBotSkeleton />;
    }

    return <WhatsAppBotPage />;
}
