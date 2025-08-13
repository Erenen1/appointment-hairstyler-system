"use client";

import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import { Appointment, AppointmentStatus, AppointmentType } from '../types';

interface AppointmentFormProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (appointment: Partial<Appointment>) => void;
    appointment?: Appointment;
    statuses: AppointmentStatus[];
    appointmentTypes: AppointmentType[];
}

export default function AppointmentForm({
    visible,
    onHide,
    onSubmit,
    appointment,
    statuses,
    appointmentTypes
}: AppointmentFormProps) {
    const [formData, setFormData] = useState<Partial<Appointment>>({
        appointmentDate: '',
        startTime: '',
        customerId: 0,
        serviceId: 0,
        staffId: 0,
        statusId: 0,
        appointmentTypeId: 0,
        customerPhone: '',
        message: '',
        notes: '',
        duration: 60,
        price: 0
    });

    useEffect(() => {
        if (appointment) {
            setFormData(appointment);
        } else {
            setFormData({
                appointmentDate: '',
                startTime: '',
                customerId: 0,
                serviceId: 0,
                staffId: 0,
                statusId: 0,
                appointmentTypeId: 0,
                customerPhone: '',
                message: '',
                notes: '',
                duration: 60,
                price: 0
            });
        }
    }, [appointment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onHide();
    };

    const handleInputChange = (field: keyof Appointment, value: string | number | Date | null | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog
            header={appointment ? "Randevu Düzenle" : "Yeni Randevu Ekle"}
            visible={visible}
            onHide={onHide}
            style={{ width: '700px' }}
            modal
            className="appointment-form-dialog"
            headerClassName="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 rounded-t-xl"
            contentClassName="p-0"
            closeOnEscape={false}
            closable={false}
        >
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Temel Bilgiler */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <i className="pi pi-user text-white text-lg"></i>
                        </div>
                        Müşteri Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Müşteri Telefonu *</label>
                            <InputText
                                value={formData.customerPhone}
                                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                placeholder="+90 5XX XXX XX XX"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Randevu Türü *</label>
                            <Dropdown
                                value={formData.appointmentTypeId}
                                onChange={(e) => handleInputChange('appointmentTypeId', e.value)}
                                options={appointmentTypes}
                                optionLabel="displayName"
                                optionValue="id"
                                placeholder="Randevu Türü Seçin"
                                className="w-full"
                                showClear
                            />
                        </div>
                    </div>
                </div>

                {/* Tarih ve Saat */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                            <i className="pi pi-calendar text-white text-lg"></i>
                        </div>
                        Tarih ve Saat
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Tarih *</label>
                            <Calendar
                                value={formData.appointmentDate ? new Date(formData.appointmentDate) : null}
                                onChange={(e) => handleInputChange('appointmentDate', e.value?.toISOString().split('T')[0])}
                                dateFormat="dd/mm/yy"
                                className="w-full"
                                showIcon
                                placeholder="Tarih Seçin"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Saat *</label>
                            <Calendar
                                value={formData.startTime ? new Date(`2000-01-01T${formData.startTime}`) : null}
                                onChange={(e) => handleInputChange('startTime', e.value?.toTimeString().slice(0, 5))}
                                timeOnly
                                hourFormat="24"
                                className="w-full"
                                showIcon
                                placeholder="Saat Seçin"
                            />
                        </div>
                    </div>
                </div>

                {/* Durum ve Mesaj */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                            <i className="pi pi-cog text-white text-lg"></i>
                        </div>
                        Durum ve Mesaj
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Durum *</label>
                            <Dropdown
                                value={formData.statusId}
                                onChange={(e) => handleInputChange('statusId', e.value)}
                                options={statuses}
                                optionLabel="displayName"
                                optionValue="id"
                                placeholder="Durum Seçin"
                                className="w-full"
                                showClear
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Müşteri Mesajı</label>
                            <InputTextarea
                                value={formData.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                rows={3}
                                className="w-full"
                                placeholder="Müşterinin randevu talebi, özel istekleri veya notları..."
                            />
                        </div>
                    </div>
                </div>

                {/* Butonlar */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button
                        type="button"
                        label="İptal"
                        severity="secondary"
                        onClick={onHide}
                        outlined
                        className="px-8 py-3 text-base font-medium"
                    />
                    <Button
                        type="submit"
                        label={appointment ? "Güncelle" : "Randevu Ekle"}
                        severity="success"
                        className="px-8 py-3 text-base font-medium"
                        icon={appointment ? "pi pi-check" : "pi pi-plus"}
                    />
                </div>
            </form>
        </Dialog>
    );
}

