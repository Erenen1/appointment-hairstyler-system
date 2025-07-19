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
import { Categories, CategoriesUpdateModalProps } from '../types/CategoriesType';
import updateCategories from '../services/UpdateCategoriesApi';


const UpdateCategoriesModal = ({ children, selectedCategory }: CategoriesUpdateModalProps) => {
    const [formData, setFormData] = useState<Categories>(selectedCategory);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        if (open) {
            setFormData(selectedCategory);
        }
    }, [selectedCategory, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getTokenToLocalStorage();
            await updateCategories(formData, token as string);
            toast.success('Kategori güncellendi ✅');
            console.log('Güncellenen Kategori:', formData);
            setFormData('' as unknown as Categories); // Formu temizle
            setOpen(false); // Modal'ı kapat
        } catch (error) {
            console.error('Kategori güncellenemedi ❌', error);
            toast.error('Kategori güncellenemedi ❌');
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
                        <DialogTitle className='mx-auto text-center'>Kategori Güncelleme Formu</DialogTitle>
                    </DialogHeader>

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="name"
                        placeholder="Kategori Adı"
                        autoComplete="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="description"
                        placeholder="Açıklama"
                        autoComplete="description"
                        value={formData.description || ''}
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

export default UpdateCategoriesModal;
