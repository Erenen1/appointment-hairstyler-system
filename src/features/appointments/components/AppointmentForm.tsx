"use client";

import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Appointment, AppointmentStatus } from '../types';
import { Service } from '../../services/types';
import { Staff } from '../../../service/dataService';

interface AppointmentFormProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (appointment: Partial<Appointment>) => void;
    appointment?: Appointment;
    services: Service[];
    staff: Staff[];
    statuses: AppointmentStatus[];
}

export default function AppointmentForm({
    visible,
    onHide,
    onSubmit,
    appointment,
    services,
    staff,
    statuses
}: AppointmentFormProps) {
    const [formData, setFormData] = useState<Partial<Appointment>>({
        appointmentDate: '',
        startTime: '',
        endTime: '',
        customerId: 0,
        serviceId: 0,
        staffId: 0,
        statusId: 0,
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
                endTime: '',
                customerId: 0,
                serviceId: 0,
                staffId: 0,
                statusId: 0,
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
            style={{ width: '800px' }}
            modal
            className="appointment-form-dialog"
            headerClassName="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 rounded-t-xl"
            contentClassName="p-0"
            closeOnEscape={false}
            closable={false}
        >
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Tarih ve Saat Bilgileri */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <i className="pi pi-calendar text-white text-lg"></i>
                        </div>
                        Tarih ve Saat Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Tarih</label>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Başlangıç Saati</label>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Bitiş Saati</label>
                            <Calendar
                                value={formData.endTime ? new Date(`2000-01-01T${formData.endTime}`) : null}
                                onChange={(e) => handleInputChange('endTime', e.value?.toTimeString().slice(0, 5))}
                                timeOnly
                                hourFormat="24"
                                className="w-full"
                                showIcon
                                placeholder="Saat Seçin"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Süre (Dakika)</label>
                            <InputNumber
                                value={formData.duration}
                                onValueChange={(e) => handleInputChange('duration', e.value)}
                                min={15}
                                max={480}
                                step={15}
                                className="w-full"
                                placeholder="Süre"
                                suffix=" dk"
                            />
                        </div>
                    </div>
                </div>

                {/* Hizmet ve Uzman Bilgileri */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                            <i className="pi pi-briefcase text-white text-lg"></i>
                        </div>
                        Hizmet ve Uzman Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Hizmet</label>
                            <Dropdown
                                value={formData.serviceId}
                                onChange={(e) => handleInputChange('serviceId', e.value)}
                                options={services}
                                optionLabel="title"
                                optionValue="id"
                                placeholder="Hizmet Seçin"
                                className="w-full"
                                showClear
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Uzman</label>
                            <Dropdown
                                value={formData.staffId}
                                onChange={(e) => handleInputChange('staffId', e.value)}
                                options={staff}
                                optionLabel="fullName"
                                optionValue="id"
                                placeholder="Uzman Seçin"
                                className="w-full"
                                showClear
                            />
                        </div>
                    </div>
                </div>

                {/* Durum ve Fiyat Bilgileri */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                            <i className="pi pi-cog text-white text-lg"></i>
                        </div>
                        Durum ve Fiyat Bilgileri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Durum</label>
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
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Fiyat</label>
                            <InputNumber
                                value={formData.price}
                                onValueChange={(e) => handleInputChange('price', e.value)}
                                mode="currency"
                                currency="TRY"
                                min={0}
                                className="w-full"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                {/* Notlar */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                            <i className="pi pi-comment text-white text-lg"></i>
                        </div>
                        Notlar
                    </h3>
                    <InputTextarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={4}
                        className="w-full"
                        placeholder="Randevu notları, özel istekler veya ek bilgiler..."
                    />
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
                        className="px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        icon={appointment ? "pi pi-check" : "pi pi-plus"}
                    />
                </div>
            </form>
        </Dialog>
    );
}

