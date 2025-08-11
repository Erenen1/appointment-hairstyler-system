"use client";

import { CustomersPage } from "@/features/customers";
import customersData from "@/mocks/customers.json";

export default function AdminCustomersPage() {
    return <CustomersPage customers={customersData} />;
}


