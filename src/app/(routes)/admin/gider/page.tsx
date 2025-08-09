"use client";

import { ExpensePage } from "@/features/expense";
import financialData from "@/mocks/financial-data.json";

export default function AdminGiderPage() {
    return (
        <ExpensePage
            expenses={financialData.expenses}
        />
    );
}
