"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, X, Plus, AlertCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Staff {
    id: number;
    name: string;
    position: string;
}

interface Appointment {
    id: number;
    date: string;
    time: string;
    customerId: number;
    staffId: number;
    notes?: string;
}

interface CalendarModalProps {
    visible: boolean;
    onHide: () => void;
    selectedDate: Date | null;
    selectedAppointment: Appointment | null;
    customers: Customer[];
    staff: Staff[];
    onSave: (appointment: Appointment) => void;
    onDelete: (appointmentId: number) => void;
}

export default function CalendarModal({
    visible,
    onHide,
    selectedDate,
    selectedAppointment,
    customers,
    staff,
    onSave,
    onDelete
}: CalendarModalProps) {
    const [formData, setFormData] = useState<Partial<Appointment>>({
        date: "",
        time: "",
        customerId: undefined,
        staffId: undefined,
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
                staffId: selectedAppointment.staffId,
                notes: selectedAppointment.notes || ""
            });
        } else if (selectedDate) {
            // Create mode - automatically set the clicked date
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            setFormData({
                date: formattedDate,
                time: "",
                customerId: undefined,
                staffId: undefined,
                notes: ""
            });
        }

        // Reset errors when modal opens
        setErrors([]);
    }, [selectedAppointment, selectedDate, visible]);

    const handleSave = () => {
        const newErrors: string[] = [];

        if (!formData.date) newErrors.push("Randevu tarihi gerekli");
        if (!formData.time) newErrors.push("Randevu saati gerekli");
        if (!formData.customerId) newErrors.push("Müşteri seçimi gerekli");
        if (!formData.staffId) newErrors.push("Personel seçimi gerekli");

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        const appointmentData: Appointment = {
            id: selectedAppointment?.id || Date.now(),
            date: formData.date!,
            time: formData.time!,
            customerId: formData.customerId!,
            staffId: formData.staffId!,
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

    const timeOptions = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ];

    return (
        <Dialog open={visible} onOpenChange={onHide}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        {selectedAppointment ? (
                            <>
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-green-600 font-medium">Randevu Düzenle</p>
                                    <p className="text-sm text-gray-500">Mevcut randevuyu güncelleyin</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-blue-600 font-medium">Yeni Randevu</p>
                                    <p className="text-sm text-gray-500">Yeni randevu oluşturun</p>
                                </div>
                            </>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {/* Selected Date Alert */}
                {formData.date && (
                    <div className={`border rounded-lg p-4 mb-6 ${selectedAppointment
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedAppointment ? 'bg-green-100' : 'bg-blue-100'
                                }`}>
                                <Info className={`h-3 w-3 ${selectedAppointment ? 'text-green-600' : 'text-blue-600'
                                    }`} />
                            </div>
                            <div className={`text-sm ${selectedAppointment ? 'text-green-800' : 'text-blue-800'
                                }`}>
                                <p className="font-medium">
                                    {selectedAppointment ? 'Randevu Tarihi:' : 'Seçilen Tarih:'}
                                </p>
                                <p className={`${selectedAppointment ? 'text-green-700' : 'text-blue-700'
                                    }`}>
                                    {format(new Date(formData.date), 'dd MMMM yyyy, EEEE', { locale: tr })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointment Details (if editing) */}
                {selectedAppointment && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                <Info className="h-3 w-3 text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Mevcut Randevu Bilgileri</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Müşteri:</span>
                                <p className="font-medium text-gray-900">
                                    {customers.find(c => c.id === selectedAppointment.customerId)?.name || 'Bilinmeyen'}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Personel:</span>
                                <p className="font-medium text-gray-900">
                                    {staff.find(s => s.id === selectedAppointment.staffId)?.name || 'Bilinmeyen'}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Saat:</span>
                                <p className="font-medium text-gray-900">{selectedAppointment.time}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Notlar:</span>
                                <p className="font-medium text-gray-900">
                                    {selectedAppointment.notes || 'Not yok'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-red-600">
                                <p className="font-medium mb-2">Lütfen aşağıdaki hataları düzeltin:</p>
                                {errors.map((error, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                                        {error}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="time" className="text-sm font-medium text-gray-700 mb-2 block">
                            Randevu Saati *
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
                        <Label htmlFor="customer" className="text-sm font-medium text-gray-700 mb-2 block">
                            Müşteri *
                        </Label>
                        <Select value={formData.customerId?.toString() || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: parseInt(value) }))}>
                            <SelectTrigger className="w-full border-gray-300">
                                <SelectValue placeholder="Müşteri seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((customer) => (
                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{customer.name}</span>
                                            <span className="text-xs text-gray-500">{customer.phone}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="staff" className="text-sm font-medium text-gray-700 mb-2 block">
                            Personel *
                        </Label>
                        <Select value={formData.staffId?.toString() || ""} onValueChange={(value) => setFormData(prev => ({ ...prev, staffId: parseInt(value) }))}>
                            <SelectTrigger className="w-full border-gray-300">
                                <SelectValue placeholder="Personel seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {staff.map((staffMember) => (
                                    <SelectItem key={staffMember.id} value={staffMember.id.toString()}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{staffMember.name}</span>
                                            <span className="text-xs text-gray-500">{staffMember.position}</span>
                                        </div>
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
                            placeholder="Randevu notları, adres bilgileri..."
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
                        className={`flex items-center gap-2 ${selectedAppointment
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {selectedAppointment ? (
                            <>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
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

