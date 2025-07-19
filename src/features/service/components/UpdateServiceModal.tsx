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
import { Service, ServiceUpdateModalProps } from '../../service/types/ServiceType';
import updateService from '../../service/services/UpdateServicesApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAllCategories } from '@/features/categories/hooks/useAllCategories';
import { useAllStaff } from '@/features/staff/hooks/useAllStaff';



const UpdateServicesModal = ({ children, selectedService }: ServiceUpdateModalProps) => {
    const [formData, setFormData] = useState<Service>(selectedService);
    const [open, setOpen] = useState(false);
    const { categoriesData, handleAllCategories } = useAllCategories();
    const { staffData, handleAllStaff } = useAllStaff();


    useEffect(() => {
        if (open) {
            setFormData(selectedService);
            handleAllCategories(); // Kategorileri yükle
            handleAllStaff(); // Personel verilerini yükle
        }
    }, [selectedService, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getTokenToLocalStorage();
            await updateService(formData, token as string);
            toast.success('Hizmet güncellendi ✅');
            console.log('Güncellenen Hizmet:', formData);
            setFormData('' as unknown as Service); // Formu temizle
            setOpen(false); // Modal'ı kapat
        } catch (error) {
            console.error('Hizmet güncellenemedi ❌', error);
            toast.error('Hizmet güncellenemedi ❌');
            throw error; // Hata fırlat
        };
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'staffMembers') {
            // Eğer staffMembers ise, JSON.parse ile diziye dönüştür
            const selectedStAff = staffData.filter(staff => staff.fullName === value);
            setFormData({ ...formData, staffMembers: selectedStAff });
            // Eğer personel seçildiyse, formData'yı güncelle
        } else {
            const valueAsNumber = isNaN(Number(value)) ? value : Number(value); // Eğer sayı ise, sayıya dönüştür
            setFormData({ ...formData, [name]: valueAsNumber });
        }
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

                    <Select
                        value={formData.category?.id ?? ''} // Kategori ID'sini kullan
                        onValueChange={(value) => {
                            const selectCat = categoriesData.find(cat => cat.id === value);
                            setFormData({
                                ...formData,
                                category: selectCat ?
                                    { id: selectCat.id, name: selectCat.name }
                                    : { id: value, name: '' } //kategori id'sini tek seçim hakkı verilerek admin sınırlandırılacak
                            });
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Kategori Seçin" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {categoriesData.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={formData?.staffMembers?.[0]?.id ?? ''}
                        onValueChange={(value) => {
                            const selectStaff = staffData.find(staff => staff.id === value); // Seçilen personeli bul
                            setFormData({
                                ...formData,
                                // Eğer personel seçildiyse, formData'yı güncelle
                                staffMembers: selectStaff ? [selectStaff] : []
                            });
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Personel Seçin" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            {staffData.map((staff) => (
                                <SelectItem key={staff.id as string} value={staff.id as string}>
                                    {staff.fullName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="title"
                        placeholder="Hizmet Adı"
                        autoComplete="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                    />

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="description"
                        placeholder="Açıklama"
                        autoComplete="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="duration"
                        placeholder="Süre"
                        value={formData.duration}
                        onChange={handleChange}
                    />

                    <Input
                        className="w-full border rounded px-3 py-2"
                        name="price"
                        placeholder="Fiyat"
                        autoComplete="price"
                        value={formData.price}
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

export default UpdateServicesModal;
