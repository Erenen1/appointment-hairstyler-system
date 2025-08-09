"use client";

import { BillsPage } from "@/features/bills";
import financialData from "@/mocks/financial-data.json";

export default function AdminAdisyonPage() {
    return (
        <BillsPage
            adisyons={financialData.adisyon}
        />
    );
}