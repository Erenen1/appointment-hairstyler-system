'use client';
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

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Customer, CustomersUpdateModalProps } from '../types/CustomersType';
import updateCustomer from '../services/UpdateCustomersApi';



const UpdateCustomersModal = ({ children, selectedCustomer }: CustomersUpdateModalProps) => {
    const [formData, setFormData] = useState<Customer>(selectedCustomer);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (open) {
            setFormData(selectedCustomer);
        }
    }, [selectedCustomer, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getTokenToLocalStorage();
            await updateCustomer(formData, token as string);
            toast.success('Müşteri güncellendi ✅');
            console.log('Güncellenen Müşteri:', formData);
            setFormData('' as unknown as Customer); // Formu temizle
            setOpen(false); // Modal'ı kapat
        } catch (error) {
            console.error('Müşteri güncellenemedi ❌', error);
            toast.error('Müşteri güncellenemedi ❌');
            throw error; // Hata fırlat
        };
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value }); // Form verilerini güncelle
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <DialogHeader>
                        <DialogTitle className='mx-auto text-center'>Müşteri Güncelleme Formu</DialogTitle>
                    </DialogHeader>

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="fullName"
                        placeholder="Müşteri Adı"
                        autoComplete="fullName"
                        value={formData.fullName || ''}
                        onChange={handleChange}
                    />
                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="phone"
                        type="tel"
                        placeholder="Telefon Numarası"
                        autoComplete="tel"
                        value={formData.phone || ''}
                        onChange={handleChange}
                    />
                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="email"
                        type="email"
                        placeholder="E-posta"
                        autoComplete="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                    />
                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="notes"
                        placeholder="Not"
                        autoComplete="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                    />
                    {/* 
                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="price"
                        placeholder="Fiyat"
                        autoComplete="price"
                        value={formData.price}
                        onChange={handleChange}
                    /> */}

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

export default UpdateCustomersModal;
