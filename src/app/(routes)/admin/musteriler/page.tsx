"use client";

import { CustomersPage } from "@/features/customers";
import customers from "@/mocks/real-estate-customers.json";

export default function AdminCustomersPage() {
    return (
        <CustomersPage
            customers={customers}
        />
    );
}


