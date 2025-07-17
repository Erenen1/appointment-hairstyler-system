'use client';

import updateStaff from '@/features/staff/services/UpdateStaffApi';
import React, { useEffect, useState } from 'react';
import { getTokenToLocalStorage } from '../../admin/utils/auth';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Staff, StaffUpdateModalProps } from '../types/StaffType';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';



const UpdateStaffModal = ({ children, selectedStaff }: StaffUpdateModalProps) => {
    const [formData, setFormData] = useState<Staff>(selectedStaff);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (open) {
            setFormData(selectedStaff);
        }
    }, [selectedStaff, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); // Form verilerini güncelle
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getTokenToLocalStorage();
            await updateStaff(formData, token as string);
            toast.success('Personel güncellendi ✅');
            setFormData('' as unknown as Staff); // Formu temizle
            setOpen(false); // Modal'ı kapat
        } catch (error) {
            console.error('Personel güncellenemedi ❌', error);
            toast.error('Personel güncellenemedi ❌');
            throw error; // Hata fırlat
        };
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <DialogHeader>
                        <DialogTitle>Personel Güncelleme Formu</DialogTitle>
                    </DialogHeader>
                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="fullName"
                        placeholder="İsim Soyisim"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={handleChange}
                    />

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="phone"
                        type="tel"
                        placeholder="Telefon Numarası"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="email"
                        type="email"
                        placeholder="E-posta"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="specialties"
                        placeholder="Uzmanlık Alanları"
                        value={formData.specialties}
                        onChange={handleChange}
                    />

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="avatar"
                        placeholder="Avatar URL"
                        autoComplete="url"
                        value={formData.avatar}
                        onChange={handleChange}
                    />

                    <Button
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                        type="submit"
                    >
                        Güncelle
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateStaffModal;
