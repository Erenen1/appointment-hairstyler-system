"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ToggleButton } from "primereact/togglebutton";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import { Service, ServiceCategory } from "./types";

interface ServicesPageProps {
    services?: Service[];
    categories?: ServiceCategory[];
}

export default function ServicesPage({
    services: initialServices = [],
    categories: initialCategories = []
}: ServicesPageProps) {
    const [servicesState, setServicesState] = useState<Service[]>(initialServices);
    const [selected, setSelected] = useState<Service | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
    const [activeOnly, setActiveOnly] = useState<boolean>(false);

    const filteredServices = useMemo(() => {
        return servicesState.filter((s) => {
            const okCategory = categoryFilter.length === 0 || categoryFilter.includes(s.categoryId);
            const okActive = !activeOnly || s.isActive;
            const text = (s.title + " " + s.price + " " + s.duration).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okCategory && okActive && okSearch;
        });
    }, [servicesState, categoryFilter, activeOnly, globalFilter]);

    const donut = useMemo(() => {
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

    // CRUD Dialog State
    type ServiceForm = { id?: number; title: string; duration: number; price: number; isActive: boolean; categoryId: number };
    const emptyForm: ServiceForm = { title: "", duration: 60, price: 0, isActive: true, categoryId: initialCategories[0]?.id ?? 1 };
    const [showDialog, setShowDialog] = useState(false);
    const [form, setForm] = useState<ServiceForm>(emptyForm);

    const openAdd = () => { setForm(emptyForm); setShowDialog(true); };
    const openEdit = () => { if (!selected) return; setForm({ id: selected.id, title: selected.title, duration: Number(selected.duration), price: Number(selected.price), isActive: selected.isActive, categoryId: selected.categoryId }); setShowDialog(true); };
    const onDelete = () => { if (!selected) return; setServicesState((arr) => arr.filter((s) => s.id !== selected.id)); setSelected(null); };
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

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Card title="Servis Dağılımı (Fiyat Bazlı)">
                <div className="flex gap-6 items-stretch">
                    <div className="w-1/2">
                        <div className="flex flex-wrap gap-2 items-center mb-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Ara..." />
                            </span>
                            <MultiSelect display="chip" value={categoryFilter} onChange={(e) => setCategoryFilter(e.value)} options={initialCategories.map(c => ({ label: c.name, value: c.id }))} placeholder="Kategoriler" className="min-w-[12rem]" />
                            <ToggleButton onLabel="Aktif" offLabel="Aktif" checked={activeOnly} onChange={(e) => setActiveOnly(e.value)} />
                            <Button icon="pi pi-plus" label="Ekle" onClick={openAdd} outlined size="small" />
                            <Button icon="pi pi-pencil" label="Düzenle" onClick={openEdit} disabled={!selected} outlined size="small" />
                            <Button icon="pi pi-trash" label="Sil" severity="danger" onClick={onDelete} disabled={!selected} outlined size="small" />
                        </div>
                        <div style={{ height: 360 }} className="overflow-auto border rounded">
                            <ul className="text-sm divide-y">
                                {filteredServices.map((s) => (
                                    <li key={s.id} className="flex items-center justify-between px-3 py-2">
                                        <span className="truncate mr-2">{s.title}</span>
                                        <span className="font-medium">{Number(s.price).toFixed(0)}₺</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div style={{ height: 360 }} className="flex items-start justify-center">
                            <Chart type="doughnut" data={donut.data} options={donut.options} style={{ height: '320px', width: '320px' }} />
                        </div>
                    </div>
                </div>
            </Card>
            <Card title="Servisler">
                <div className="flex flex-wrap gap-2 justify-between items-center pb-3">
                    <div className="flex gap-2 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Ara..." />
                        </span>
                        <MultiSelect display="chip" value={categoryFilter} onChange={(e) => setCategoryFilter(e.value)} options={initialCategories.map(c => ({ label: c.name, value: c.id }))} placeholder="Kategoriler" className="min-w-[12rem]" />
                        <ToggleButton onLabel="Aktif" offLabel="Aktif" checked={activeOnly} onChange={(e) => setActiveOnly(e.value)} />
                    </div>
                    <div className="flex gap-2">
                        <Button icon="pi pi-plus" label="Ekle" onClick={openAdd} />
                        <Button icon="pi pi-pencil" label="Düzenle" onClick={openEdit} disabled={!selected} />
                        <Button icon="pi pi-trash" label="Sil" severity="danger" onClick={onDelete} disabled={!selected} />
                    </div>
                </div>
                <DataTable value={filteredServices} paginator rows={10} stripedRows tableStyle={{ minWidth: "50rem" }}
                    selectionMode="single" selection={selected} onSelectionChange={(e) => setSelected(e.value as Service)}
                    sortMode="multiple" removableSort globalFilter={globalFilter} globalFilterFields={["title", "duration", "price"]}>
                    <Column field="title" header="Başlık" sortable filter filterPlaceholder="Ara" />
                    <Column field="duration" header="Süre (dk)" sortable />
                    <Column field="price" header="Fiyat" sortable />
                    <Column field="isActive" header="Aktif" />
                </DataTable>
            </Card>
            <Dialog header={form.id ? "Servis Düzenle" : "Servis Ekle"} visible={showDialog} style={{ width: "520px" }} onHide={() => setShowDialog(false)}>
                <div className="grid gap-4">
                    <span className="p-float-label">
                        <InputText id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full" />
                        <label htmlFor="title">Başlık</label>
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                        <span className="p-float-label">
                            <InputNumber inputId="duration" value={form.duration} onValueChange={(e) => setForm({ ...form, duration: Number(e.value || 0) })} className="w-full" suffix=" dk" min={0} />
                            <label htmlFor="duration">Süre</label>
                        </span>
                        <span className="p-float-label">
                            <InputNumber inputId="price" value={form.price} onValueChange={(e) => setForm({ ...form, price: Number(e.value || 0) })} className="w-full" suffix=" ₺" min={0} mode="decimal" />
                            <label htmlFor="price">Fiyat</label>
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 items-center">
                        <span className="p-float-label">
                            <Dropdown inputId="category" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.value })} options={initialCategories.map(c => ({ label: c.name, value: c.id }))} className="w-full" />
                            <label htmlFor="category">Kategori</label>
                        </span>
                        <div className="flex items-center gap-2">
                            <Checkbox inputId="active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.checked ?? false })} />
                            <label htmlFor="active">Aktif</label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button label="Vazgeç" outlined onClick={() => setShowDialog(false)} />
                        <Button label="Kaydet" icon="pi pi-check" onClick={onSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
