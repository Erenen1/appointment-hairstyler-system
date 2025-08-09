"use client";

import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Service {
    id: number;
    name: string;
    price: number;
    duration: number;
}

interface Staff {
    id: number;
    name: string;
    position: string;
}

interface AppointmentStatus {
    id: number;
    name: string;
    color: string;
}

interface Appointment {
    id: number;
    date: string;
    time: string;
    customerId: number;
    serviceId: number;
    staffId: number;
    statusId: number;
    notes?: string;
}

interface CalendarModalProps {
    visible: boolean;
    onHide: () => void;
    selectedDate: Date | null;
    selectedAppointment: Appointment | null;
    customers: Customer[];
    services: Service[];
    staff: Staff[];
    statuses: AppointmentStatus[];
    onSave: (appointment: Appointment) => void;
    onDelete: (appointmentId: number) => void;
}

export default function CalendarModal({
    visible,
    onHide,
    selectedDate,
    selectedAppointment,
    customers,
    services,
    staff,
    statuses,
    onSave,
    onDelete
}: CalendarModalProps) {
    const [formData, setFormData] = useState<Partial<Appointment>>({
        date: "",
        time: "",
        customerId: null,
        serviceId: null,
        staffId: null,
        statusId: null,
        notes: ""
    });

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (selectedAppointment) {
            // Edit mode - populate form with existing appointment data
            setFormData({
                id: selectedAppointment.id,
                date: selectedAppointment.date,
                time: selectedAppointment.time,
                customerId: selectedAppointment.customerId,
                serviceId: selectedAppointment.serviceId,
                staffId: selectedAppointment.staffId,
                statusId: selectedAppointment.statusId,
                notes: selectedAppointment.notes || ""
            });
        } else if (selectedDate) {
            // Create mode - set selected date
            setFormData({
                date: selectedDate.toISOString().split('T')[0],
                time: "",
                customerId: null,
                serviceId: null,
                staffId: null,
                statusId: null,
                notes: ""
            });
        }
    }, [selectedAppointment, selectedDate]);

    const handleSave = () => {
        const newErrors: string[] = [];

        if (!formData.date) newErrors.push("Randevu tarihi gerekli");
        if (!formData.time) newErrors.push("Randevu saati gerekli");
        if (!formData.customerId) newErrors.push("Müşteri seçimi gerekli");
        if (!formData.serviceId) newErrors.push("Hizmet seçimi gerekli");
        if (!formData.staffId) newErrors.push("Personel seçimi gerekli");
        if (!formData.statusId) newErrors.push("Durum seçimi gerekli");

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        const appointmentData: Appointment = {
            id: selectedAppointment?.id || Date.now(),
            date: formData.date!,
            time: formData.time!,
            customerId: formData.customerId!,
            serviceId: formData.serviceId!,
            staffId: formData.staffId!,
            statusId: formData.statusId!,
            notes: formData.notes || ""
        };

        onSave(appointmentData);
        onHide();
        setErrors([]);
    };

    const handleDelete = () => {
        if (selectedAppointment) {
            onDelete(selectedAppointment.id);
            onHide();
        }
    };

    const resetForm = () => {
        setFormData({
            date: "",
            time: "",
            customerId: null,
            serviceId: null,
            staffId: null,
            statusId: null,
            notes: ""
        });
        setErrors([]);
    };

    const timeOptions = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
        "18:00", "18:30", "19:00", "19:30", "20:00"
    ];

    const getStatusColor = (statusId: number) => {
        const status = statuses.find(s => s.id === statusId);
        return status?.color || "#6c757d";
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={selectedAppointment ? "Randevu Düzenle" : "Yeni Randevu"}
            style={{ width: '600px' }}
            modal
            className="p-fluid"
            onShow={resetForm}
        >
            {errors.length > 0 && (
                <Message
                    severity="error"
                    text={errors.join(", ")}
                    className="mb-4"
                />
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label htmlFor="date" className="font-medium text-gray-700 mb-2 block">
                        Randevu Tarihi
                    </label>
                    <Calendar
                        id="date"
                        value={formData.date ? new Date(formData.date) : null}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.value?.toISOString().split('T')[0] || "" }))}
                        dateFormat="dd/mm/yy"
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="time" className="font-medium text-gray-700 mb-2 block">
                        Randevu Saati
                    </label>
                    <Dropdown
                        id="time"
                        value={formData.time}
                        options={timeOptions}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.value }))}
                        placeholder="Saat seçin"
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="font-medium text-gray-700 mb-2 block">
                        Durum
                    </label>
                    <Dropdown
                        id="status"
                        value={formData.statusId}
                        options={statuses}
                        onChange={(e) => setFormData(prev => ({ ...prev, statusId: e.value }))}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Durum seçin"
                        className="w-full"
                        itemTemplate={(option) => (
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: option.color }}
                                ></div>
                                <span>{option.name}</span>
                            </div>
                        )}
                    />
                </div>

                <div>
                    <label htmlFor="customer" className="font-medium text-gray-700 mb-2 block">
                        Müşteri
                    </label>
                    <Dropdown
                        id="customer"
                        value={formData.customerId}
                        options={customers}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.value }))}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Müşteri seçin"
                        className="w-full"
                    />
                </div>

                <div>
                    <label htmlFor="service" className="font-medium text-gray-700 mb-2 block">
                        Hizmet
                    </label>
                    <Dropdown
                        id="service"
                        value={formData.serviceId}
                        options={services}
                        onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.value }))}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Hizmet seçin"
                        className="w-full"
                        itemTemplate={(option) => (
                            <div className="flex justify-between items-center w-full">
                                <span>{option.name}</span>
                                <span className="text-sm text-gray-500">{option.price}₺</span>
                            </div>
                        )}
                    />
                </div>

                <div>
                    <label htmlFor="staff" className="font-medium text-gray-700 mb-2 block">
                        Personel
                    </label>
                    <Dropdown
                        id="staff"
                        value={formData.staffId}
                        options={staff}
                        onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.value }))}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Personel seçin"
                        className="w-full"
                    />
                </div>

                <div className="col-span-2">
                    <label htmlFor="notes" className="font-medium text-gray-700 mb-2 block">
                        Notlar
                    </label>
                    <InputTextarea
                        id="notes"
                        value={formData.notes || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        placeholder="Randevu notları..."
                        className="w-full"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                {selectedAppointment && (
                    <Button
                        label="Sil"
                        icon="pi pi-trash"
                        severity="danger"
                        onClick={handleDelete}
                        className="px-4"
                    />
                )}
                <Button
                    label="İptal"
                    icon="pi pi-times"
                    severity="secondary"
                    onClick={onHide}
                    className="px-4"
                />
                <Button
                    label={selectedAppointment ? "Güncelle" : "Kaydet"}
                    icon={selectedAppointment ? "pi pi-check" : "pi pi-plus"}
                    onClick={handleSave}
                    className="px-4"
                />
            </div>
        </Dialog>
    );
}

