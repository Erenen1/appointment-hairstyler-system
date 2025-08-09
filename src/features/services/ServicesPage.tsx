"use client";

import "chart.js/auto";
import { Card } from "primereact/card";
import { Service, ServiceCategory } from "./types";
import { useServices } from "./hooks/useServices";
import {
    ServicesChart,
    ServicesFilters,
    ServicesTable,
    ServiceFormDialog
} from "./components";

interface ServicesPageProps {
    services?: Service[];
    categories?: ServiceCategory[];
}

export default function ServicesPage({
    services: initialServices = [],
    categories: initialCategories = []
}: ServicesPageProps) {
    const {
        selected,
        setSelected,
        globalFilter,
        setGlobalFilter,
        categoryFilter,
        setCategoryFilter,
        activeOnly,
        setActiveOnly,
        showDialog,
        setShowDialog,
        form,
        setForm,
        filteredServices,
        chartData,
        openAdd,
        openEdit,
        onDelete,
        onSave
    } = useServices(initialServices, initialCategories);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <ServicesChart
                filteredServices={filteredServices}
                chartData={chartData}
            />

            <Card title="Servisler">
                <ServicesFilters
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    activeOnly={activeOnly}
                    setActiveOnly={setActiveOnly}
                    categories={initialCategories}
                    selected={selected}
                    onAdd={openAdd}
                    onEdit={openEdit}
                    onDelete={onDelete}
                />

                <ServicesTable
                    filteredServices={filteredServices}
                    selected={selected}
                    onSelectionChange={setSelected}
                    globalFilter={globalFilter}
                />
            </Card>

            <ServiceFormDialog
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                form={form}
                setForm={setForm}
                categories={initialCategories}
                onSave={onSave}
            />
        </div>
    );
}
