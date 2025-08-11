"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2, X, Save, Plus } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

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
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
            // Create mode - automatically set the clicked date
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            setFormData({
                date: formattedDate,
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

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
            setIsDatePickerOpen(false);
        }
    };

    return (
        <Dialog open={visible} onOpenChange={onHide}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        {selectedAppointment ? "Randevu Düzenle" : "Yeni Randevu"}
                    </DialogTitle>
                </DialogHeader>

                {errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="text-sm text-red-600">
                            {errors.map((error, index) => (
                                <div key={index}>• {error}</div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
                            Randevu Tarihi
                        </Label>
                        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.date ? format(new Date(formData.date), 'dd MMMM yyyy', { locale: tr }) : "Tarih seçin"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.date ? new Date(formData.date) : undefined}
                                    onSelect={handleDateSelect}
                                    initialFocus
                                    locale={tr}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label htmlFor="time" className="text-sm font-medium text-gray-700 mb-2 block">
                            Randevu Saati
                        </Label>
                        <Select value={formData.time || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                            <SelectTrigger className="w-full border-gray-300">
                                <SelectValue placeholder="Saat seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeOptions.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                            Durum
                        </Label>
                        <Select value={formData.statusId?.toString() || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, statusId: parseInt(value) }))}>
                            <SelectTrigger className="w-full border-gray-300">
                                <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status.id} value={status.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: status.color }}
                                            ></div>
                                            <span>{status.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="customer" className="text-sm font-medium text-gray-700 mb-2 block">
                            Müşteri
                        </Label>
                        <Select value={formData.customerId?.toString() || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: parseInt(value) }))}>
                            <SelectTrigger className="w-full border-gray-300">
                                <SelectValue placeholder="Müşteri seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                        {customer.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="service" className="text-sm font-medium text-gray-700 mb-2 block">
                            Hizmet
                        </Label>
                        <Select value={formData.serviceId?.toString() || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: parseInt(value) }))}>
                            <SelectTrigger className="w-full border-gray-300">
                                <SelectValue placeholder="Hizmet seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem key={service.id} value={service.id.toString()}>
                                        <div className="flex justify-between items-center w-full">
                                            <span>{service.name}</span>
                                            <span className="text-sm text-gray-500 ml-2">{service.price}₺</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="staff" className="text-sm font-medium text-gray-700 mb-2 block">
                            Personel
                        </Label>
                        <Select value={formData.staffId?.toString() || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: parseInt(value) }))}>
                            <SelectTrigger className="w-full border-gray-300">
                                <SelectValue placeholder="Personel seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {staff.map((staffMember) => (
                                    <SelectItem key={staffMember.id} value={staffMember.id.toString()}>
                                        {staffMember.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-2 block">
                            Notlar
                        </Label>
                        <Textarea
                            id="notes"
                            value={formData.notes || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={3}
                            placeholder="Randevu notları..."
                            className="w-full border-gray-300 resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                    {selectedAppointment && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Sil
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onHide}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        İptal
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        {selectedAppointment ? (
                            <>
                                <Save className="h-4 w-4" />
                                Güncelle
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                Kaydet
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

