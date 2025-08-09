"use client";

import { IncomePage } from "@/features/income";
import financialData from "@/mocks/financial-data.json";

export default function AdminGelirPage() {
    return (
        <IncomePage
            income={financialData.income}
        />
    );
}
