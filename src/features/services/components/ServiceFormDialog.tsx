"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { ServiceCategory } from "../types";
import { ServiceForm } from "../hooks/useServices";

interface ServiceFormDialogProps {
    visible: boolean;
    onHide: () => void;
    form: ServiceForm;
    setForm: (form: ServiceForm) => void;
    categories: ServiceCategory[];
    onSave: () => void;
}

export const ServiceFormDialog = ({
    visible,
    onHide,
    form,
    setForm,
    categories,
    onSave
}: ServiceFormDialogProps) => {
    return (
        <Dialog
            header={form.id ? "Servis Düzenle" : "Servis Ekle"}
            visible={visible}
            style={{ width: "520px" }}
            onHide={onHide}
        >
            <div className="grid gap-4">
                <span className="p-float-label">
                    <InputText
                        id="title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full"
                    />
                    <label htmlFor="title">Başlık</label>
                </span>
                <div className="grid grid-cols-2 gap-3">
                    <span className="p-float-label">
                        <InputNumber
                            inputId="duration"
                            value={form.duration}
                            onValueChange={(e) => setForm({ ...form, duration: Number(e.value || 0) })}
                            className="w-full"
                            suffix=" dk"
                            min={0}
                        />
                        <label htmlFor="duration">Süre</label>
                    </span>
                    <span className="p-float-label">
                        <InputNumber
                            inputId="price"
                            value={form.price}
                            onValueChange={(e) => setForm({ ...form, price: Number(e.value || 0) })}
                            className="w-full"
                            suffix=" ₺"
                            min={0}
                            mode="decimal"
                        />
                        <label htmlFor="price">Fiyat</label>
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-3 items-center">
                    <span className="p-float-label">
                        <Dropdown
                            inputId="category"
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.value })}
                            options={categories.map(c => ({ label: c.name, value: c.id }))}
                            className="w-full"
                        />
                        <label htmlFor="category">Kategori</label>
                    </span>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            inputId="active"
                            checked={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: e.checked ?? false })}
                        />
                        <label htmlFor="active">Aktif</label>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button label="Vazgeç" outlined onClick={onHide} />
                    <Button label="Kaydet" icon="pi pi-check" onClick={onSave} />
                </div>
            </div>
        </Dialog>
    );
};
