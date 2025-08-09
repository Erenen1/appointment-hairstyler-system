import { useState, useMemo } from "react";
import { Service, ServiceCategory } from "../types";

export interface ServiceForm {
    id?: number;
    title: string;
    duration: number;
    price: number;
    isActive: boolean;
    categoryId: number;
}

export const useServices = (initialServices: Service[], initialCategories: ServiceCategory[]) => {
    const [servicesState, setServicesState] = useState<Service[]>(initialServices);
    const [selected, setSelected] = useState<Service | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
    const [activeOnly, setActiveOnly] = useState<boolean>(false);

    // CRUD Dialog State
    const emptyForm: ServiceForm = {
        title: "",
        duration: 60,
        price: 0,
        isActive: true,
        categoryId: initialCategories[0]?.id ?? 1
    };
    const [showDialog, setShowDialog] = useState(false);
    const [form, setForm] = useState<ServiceForm>(emptyForm);

    const filteredServices = useMemo(() => {
        return servicesState.filter((s) => {
            const okCategory = categoryFilter.length === 0 || categoryFilter.includes(s.categoryId);
            const okActive = !activeOnly || s.isActive;
            const text = (s.title + " " + s.price + " " + s.duration).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okCategory && okActive && okSearch;
        });
    }, [servicesState, categoryFilter, activeOnly, globalFilter]);

    const chartData = useMemo(() => {
        const labels = filteredServices.map((s) => s.title);
        const data = filteredServices.map((s) => Number(s.price || 0));
        const colors = [
            "#5B8FF9", "#5AD8A6", "#5D7092", "#F6BD16", "#E8684A", "#6DC8EC", "#9270CA", "#FF9D4D", "#269A99", "#FF99C3",
            "#B8E986", "#2B90D9", "#F45D48", "#9B5DE5", "#00BBF9", "#00F5D4", "#FEE440", "#F15BB5", "#D9ED92", "#76C893",
        ];
        return {
            data: { labels, datasets: [{ data, backgroundColor: colors }] } as Record<string, unknown>,
            options: { cutout: "65%", plugins: { legend: { position: "right" } }, maintainAspectRatio: false, responsive: true } as Record<string, unknown>,
        };
    }, [filteredServices]);

    const openAdd = () => {
        setForm(emptyForm);
        setShowDialog(true);
    };

    const openEdit = () => {
        if (!selected) return;
        setForm({
            id: selected.id,
            title: selected.title,
            duration: Number(selected.duration),
            price: Number(selected.price),
            isActive: selected.isActive,
            categoryId: selected.categoryId
        });
        setShowDialog(true);
    };

    const onDelete = () => {
        if (!selected) return;
        setServicesState((arr) => arr.filter((s) => s.id !== selected.id));
        setSelected(null);
    };

    const onSave = () => {
        if (!form.title.trim()) return;
        if (form.id) {
            setServicesState((arr) => arr.map((s) => (s.id === form.id ? {
                ...s,
                title: form.title,
                duration: String(form.duration),
                price: String(form.price),
                isActive: form.isActive,
                categoryId: form.categoryId
            } : s)));
        } else {
            const newId = Math.max(0, ...servicesState.map((s) => s.id)) + 1;
            const newService: Service = {
                id: newId,
                categoryId: form.categoryId,
                slug: form.title.toLowerCase().replace(/\s+/g, '-'),
                title: form.title,
                description: "",
                duration: String(form.duration),
                price: String(form.price),
                icon: "scissors",
                isActive: form.isActive,
                orderIndex: servicesState.length + 1,
                benefits: [],
                includes: [],
                recommendedFor: [],
                beforeAfterImages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setServicesState((arr) => [...arr, newService]);
        }
        setShowDialog(false);
    };

    return {
        // State
        servicesState,
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

        // Computed
        filteredServices,
        chartData,

        // Actions
        openAdd,
        openEdit,
        onDelete,
        onSave
    };
};
