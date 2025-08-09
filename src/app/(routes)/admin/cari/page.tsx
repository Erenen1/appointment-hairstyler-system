"use client";

import { CurrentAccountsPage } from "@/features/current-accounts";
import financialData from "@/mocks/financial-data.json";

export default function AdminCariPage() {
    return (
        <CurrentAccountsPage
            customers={financialData.customers}
        />
    );
}
